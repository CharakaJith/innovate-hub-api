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
    },

    /**
     * Function to fetch a record from table "user" by coulmn 'id'
     * 
     * @param {Integer} id: id of the user 
     * @returns an object of user details if exists, else null
     */
    findUserById: async (id) => {
        try {
            return await models.User.findOne({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching the user by id: ${error.message}`);
        }
    },

    /**
     * Function to fetch a record from table "user" by coulmn 'userAdminId'
     * 
     * @param {Integer} adminId: id of the admin user belongs to 
     * @returns an array of user detail objects if exists, else an empty array
     */
    findUsersByAdminId: async (adminId) => {
        try {
            return await models.User.findAll({
                where: {
                    userAdminId: adminId,
                },
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching the user by admin id: ${error.message}`);
        }
    },

    /**
     * Function to create a new record in table "user"
     * 
     * @param {Objects} userDetails: user details object 
     * @returns a newly created employee object
     */
    createNewUser: async (userDetails) => {
        try {
            return await models.User.create(userDetails);
        } catch (error) {
            throw new Error(`Internal server error while creating a new user: ${error.message}`);
        }
    },

    /**
     * Function to update an existing record in table "user"
     * 
     * @param {Object} userDetails: user details object  
     * @returns 
     */
    updateUserById: async (userDetails) => {
        try {
            return await models.User.update(userDetails, {
                where: {
                    id: userDetails.id
                },
                returning: true
            });
        } catch (error) {
            throw new Error(`Internal server error while updating user by id: ${error.message}`);
        }
    }
};

module.exports = UserService;