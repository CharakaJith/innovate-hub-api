const bcrypt = require('bcrypt');
const logger = require('../middleware/logger/logger');
const field_validator = require('../util/fieldValidator');
const jwt_service = require('../util/jwtService');
const UserService = require('../services/user.services');

const UserController = {
    userLogin: async (req, res) => {
        try {
            const { email , password } = req.body;

            // validate user inputs
            const errorArray = [];
            errorArray.push(await field_validator.check_empty_string(password, 'password', 'password'));
            errorArray.push(await field_validator.check_email(email, 'email'));

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
                isActive: user.isActive,
            };
            const accessToken = await jwt_service.generate_access_token(tokenUser);

            logger('info', true, 200, `User ${user.id} | ${user.userEmail} logged in!`, req)            
            res.set({
                'Access-Token': accessToken,
            });
            return res.status(200).json({
                success: true,
                message: 'ok'
            });
        } catch (error) {
            logger('error', false, 500, error.message, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
};

module.exports = UserController;