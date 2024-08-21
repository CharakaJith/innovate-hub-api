const bcrypt = require('bcrypt');
const logger = require('../middleware/logger/logger');
const field_validator = require('../util/field_validator');
const jwt_service = require('../util/jwt_service');
const UserService = require('../services/user.service');
const { USER_ROLE } = require('../enum/user');
const { LOG_TYPE } = require('../enum/log');
const { MESSAGE } = require('../enum/message');

const AdminController = {
    adminSignUp: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // validate user inputs
            const errorArray = [];   
            errorArray.push(await field_validator.check_empty_string(name, 'name', 'Admin name')); 
            errorArray.push(await field_validator.check_email(email, 'email'));
            errorArray.push(await field_validator.check_empty_string(password, 'password', 'Admin password'));

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
            const user = await UserService.findUserByEmail(email);
            if (user) {
                throw new Error(MESSAGE.ADMIN_ALREADY_REGISTERED(email));
            }

            // hash password
            const encryptedPassword = await bcrypt.hash(password, 10);

            // create new admin
            const adminDetails = {
                userName: name,
                userEmail: email,
                userPassword: encryptedPassword,
                userRole: USER_ROLE.SUPER_ADMIN,
                isActive: true,
            };
            const newAdmin = await UserService.createNewUser(adminDetails);

            // generate access token
            const tokenUser = {
                id: newAdmin.dataValues.id,
                name: newAdmin.dataValues.userName,
                email: newAdmin.dataValues.userEmail,
                role: newAdmin.dataValues.userRole,
                isActive: newAdmin.dataValues.isActive,
            };
            const accessToken = await jwt_service.generate_access_token(tokenUser);

            // remove password hash
            delete newAdmin.dataValues.userPassword;

            logger(LOG_TYPE.INFO, true, 200, `Admin ${newAdmin.dataValues.id} | ${newAdmin.dataValues.userEmail} signed in!`, req)
            res.set({
                'Access-Token': accessToken,
            });
            return res.status(200).json({
                success: true,
                message: newAdmin,
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to signup admin: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
};

module.exports = AdminController;