const bcrypt = require('bcrypt');
const logger = require('../middleware/logger/logger');
const field_validator = require('../util/field_validator');
const jwt_service = require('../util/jwt_service');
const email_service = require('../util/email_service');
const UserService = require('../services/user.service');
const { LOG_TYPE } = require('../enum/log');
const { USER_ROLE } = require('../enum/user');

const UserController = {
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
                throw new Error('Invalid email or password!');
            }

            // validate password and remove it
            const isValidPassword = await bcrypt.compare(password, user.userPassword);
            if (!isValidPassword) {
                throw new Error('Invalid email or password!');
            }
            delete user.dataValues.userPassword;

            // is user active
            if (!user.isActive) {
                throw new Error('User not active!');
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

            logger(LOG_TYPE.INFO, true, 200, `User ${user.id} | ${user.userEmail} logged in!`, req)            
            res.set({
                'Access-Token': accessToken,
            });
            return res.status(200).json({
                success: true,
                message: 'Login successful!',
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, error.message, req);

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
                throw new Error('Permission denied!');
            }

            // check if email exists
            const user = await UserService.findUserByEmail(email);
            if (user) {
                throw new Error(`User ${email} is already invited!`);
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

            logger(LOG_TYPE.INFO, true, 200, `New user ${newUser.dataValues.id} | ${newUser.dataValues.userEmail} is created!`, req)
            return res.status(200).json({
                success: true,
                message: 'User invited!',
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, error.message, req);

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
                throw new Error('Invalid user id!');
            }

            // validate user
            if (user.userEmail != email) {
                throw new Error('Permission denied!');
            }
            if (user.isActive) {
                throw new Error(`User ${email} is already registered!`);
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

            logger(LOG_TYPE.INFO, true, 200, `User ${updatedUser[1][0].dataValues.id} | ${updatedUser[1][0].dataValues.userEmail} is registered!`, req)
            return res.status(200).json({
                success: true,
                message: 'User registered!',
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, error.message, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
};

module.exports = UserController;