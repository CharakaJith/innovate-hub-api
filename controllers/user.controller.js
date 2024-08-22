const bcrypt = require('bcrypt');
const logger = require('../middleware/logger/logger');
const field_validator = require('../util/field_validator');
const jwt_service = require('../util/jwt_service');
const email_service = require('../util/email_service');
const UserService = require('../services/user.service');
const { LOG_TYPE } = require('../enum/log');
const { USER_ROLE } = require('../enum/user');
const { MESSAGE } = require('../enum/message');

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const admin = req.user;

            // get users
            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            const users = await UserService.findUsersByAdminId(adminId);

            // seperate active vs inactive users
            const activeUsers = users.filter(user => user.isActive);
            const inactiveUsers = users.filter(user => !user.isActive);

            logger(LOG_TYPE.INFO, true, 200, `All users fetched by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                data: {
                    activeUsers,
                    inactiveUsers,
                },
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to get all users: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },
    
    getUserById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const admin = req.user;            

            // validate user
            const user = await UserService.findUserById(id);
            if (!user) {
                throw new Error(MESSAGE.INVALID_USER_ID(id));
            }

            // check request user accessibility
            const isDifferentAdmin = (id !== admin.id && user.userAdminId !== admin.adminId);
            const isUnauthorizedRole = (admin.role === USER_ROLE.MEMBER && [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN].includes(user.userRole));
            if (isDifferentAdmin || isUnauthorizedRole) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // remove password hash
            delete user.dataValues.userPassword;

            logger(LOG_TYPE.INFO, true, 200, `User ${user.id} | ${user.userEmail} fetched by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to get user by id: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    inviteUser: async (req, res) => {
        try {
            const { name, email , role, team } = req.body;

            // validate user inputs
            const errorArray = [];
            errorArray.push(await field_validator.check_empty_string(name, 'name', 'User name'));
            errorArray.push(await field_validator.check_email(email, 'email'));
            errorArray.push(await field_validator.check_role(role, 'role'));
            errorArray.push(await field_validator.check_team(team, 'team'));
          
            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger('error', false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            } 

            // check admin role
            if (req.user.role == USER_ROLE.ADMIN && role == USER_ROLE.SUPER_ADMIN) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // check if email exists
            const user = await UserService.findUserByEmail(email);
            if (user) {
                throw new Error(MESSAGE.USER_ALREADY_INVITED(email));
            }

            // create new user
            const userDetails = {
                userName: name,
                userEmail: email,
                userRole: role,
                userTeam: team,
                userAdminId: req.user.role == USER_ROLE.SUPER_ADMIN ? req.user.id : req.user.adminId,
                isActive: false,
            };
            const newUser = await UserService.createNewUser(userDetails);

            // send user invitation email
            // await email_service.send_user_invitation(newUser.userEmail, req.user.name);

            logger(LOG_TYPE.INFO, true, 200, `New user ${newUser.dataValues.id} | ${newUser.dataValues.userEmail} is created!`, req);
            return res.status(200).json({
                success: true,
                data: newUser,
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to invite the user: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    userLogin: async (req, res) => {
        try {
            const { email , password } = req.body;

            // validate user inputs
            const errorArray = [];            
            errorArray.push(await field_validator.check_email(email, 'email'));
            errorArray.push(await field_validator.check_empty_string(password, 'password', 'User password'));

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger('error', false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            } 

            // validate user
            const user = await UserService.findUserByEmail(email);
            if (!user) {
                throw new Error(MESSAGE.LOGIN_FAILED);
            }

            // validate password and remove it
            const isValidPassword = await bcrypt.compare(password, user.userPassword);
            if (!isValidPassword) {
                throw new Error(MESSAGE.LOGIN_FAILED);
            }
            delete user.dataValues.userPassword;

            // is user active
            if (!user.isActive) {
                throw new Error(MESSAGE.USER_INACTIVE(email));
            }

            // generate access token
            const tokenUser = {
                id: user.id,
                name: user.userName,
                email: user.userEmail,
                role: user.userRole,
                team: user.userTeam,
                adminId: user.userAdminId,
                isActive: user.isActive,
            };
            const accessToken = await jwt_service.generate_access_token(tokenUser);

            logger(LOG_TYPE.INFO, true, 200, `User ${user.id} | ${user.userEmail} logged in!`, req);            
            res.set({
                'Access-Token': accessToken,
            });
            return res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to login user: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },    

    registerUser: async (req, res) => {
        try {
            const { id, email, password } = req.body;

            // validate user inputs
            const errorArray = [];  
            errorArray.push(await field_validator.check_empty_number(id, 'id', 'User id')); 
            errorArray.push(await field_validator.check_email(email, 'email'));
            errorArray.push(await field_validator.check_empty_string(password, 'password', 'User password'));

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger('error', false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            } 

            // check if email exists
            const user = await UserService.findUserById(id);
            if (!user) {
                throw new Error(MESSAGE.INVALID_USER_ID(id));
            }

            // validate user
            if (user.userEmail != email) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }
            if (user.isActive) {
                throw new Error(MESSAGE.USER_ALREADY_REGISTERED(email));
            }

            // hash password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // update user 
            const userDetails = {
                id: id,
                userPassword: encryptedPassword,
                isActive: true,
            };
            const updatedUser = await UserService.updateUserById(userDetails);

            // remove password hash
            delete updatedUser[1][0].dataValues.userPassword;

            logger(LOG_TYPE.INFO, true, 200, `User ${updatedUser[1][0].dataValues.id} | ${updatedUser[1][0].dataValues.userEmail} is registered!`, req);
            return res.status(200).json({
                success: true,
                data: updatedUser[1][0],
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to register the user: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { name, password, role, team } = req.body;
            const admin = req.user;            

            // validate user inputs
            const errorArray = [];
            errorArray.push(await field_validator.check_empty_string(name, 'name', 'User name'));
            errorArray.push(await field_validator.check_role(role, 'role'));
            errorArray.push(await field_validator.check_team(team, 'team'));

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger('error', false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            }             

            // validate user
            const user = await UserService.findUserById(id);
            if (!user) {
                throw new Error(MESSAGE.INVALID_USER_ID(id));
            }

            // check request user accesibility
            const isDifferentAdmin = (id !== admin.id && user.userAdminId !== admin.adminId);
            const isUnauthorizedRole = (admin.role === USER_ROLE.MEMBER && [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN].includes(user.userRole));
            if (isDifferentAdmin || isUnauthorizedRole) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // hash user password
            let encryptedPassword;
            if (admin.id == user.id && password && password.trim().length != 0) {                
                encryptedPassword = await bcrypt.hash(password, 10);
            }

            // update user
            const userDetails = {
                id: user.id,
                userName: name,
                userPassword: encryptedPassword ? encryptedPassword : user.userPassword,
                userRole: role,
                userTeam: team,
            };
            const updatedUser = await UserService.updateUserById(userDetails);

            // remove password hash
            delete updatedUser[1][0].dataValues.userPassword;

            logger(LOG_TYPE.INFO, true, 200, `User ${updatedUser[1][0].dataValues.id} | ${updatedUser[1][0].dataValues.userEmail} is disabled by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: updatedUser[1][0],
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to update the user: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    disableUser: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const adminId = req.user.id;
            const admin = req.user;

            // validate user
            const user = await UserService.findUserById(id);
            if (!user) {
                throw new Error(MESSAGE.INVALID_USER_ID(id));
            }

            // check user accesibility
            const isSameUser = (id === adminId);
            const isDifferentAdminId = (admin.adminId !== user.userAdminId);
            const isUnauthorizedRoleEscalation = (admin.role === USER_ROLE.ADMIN && user.userRole === USER_ROLE.SUPER_ADMIN);
            if (isSameUser || isDifferentAdminId || isUnauthorizedRoleEscalation) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // disable user
            const userDetails = {
                id: user.id,
                isActive: false,
            };
            const updatedUser = await UserService.updateUserById(userDetails);

            logger(LOG_TYPE.INFO, true, 200, `User ${updatedUser[1][0].dataValues.id} | ${updatedUser[1][0].dataValues.userEmail} is disabled by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                data: 'User disabled!',
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to disable the user: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
};

module.exports = UserController;