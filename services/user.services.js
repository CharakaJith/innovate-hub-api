const models = require('../models');

const UserService = {
    /**
     * Function to fetch a record from table "user" by coulmn 'userEmail'
     * 
     * @param {String} email: email of the user 
     * @returns an object of user details if exists, else null
     */
    findUserByEmail: async (email) => {
        try {
            return await models.User.findOne({
                where: {
                    userEmail: email,
                },
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching the user by email: ${error.message}`);
        }
    }
};

module.exports = UserService;