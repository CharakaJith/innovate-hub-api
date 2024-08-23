const models = require('../models');

const MeetingService = {
    /**
     * Functions to create a new record in "meeting"
     * 
     * @param {Object} meetingDetails: meeting details object 
     * @returns a newly created meeting object
     */
    createNewMeeting: async (meetingDetails) => {
        try {
            return await models.Meeting.create(meetingDetails);
        } catch (error) {
            throw new Error(`Internal server error while creating a new meeting: ${error.message}`);
        }
    },

    /**
     * Function to fetch a record from table "metting" by column 'productId', 'time' and 'adminId'
     * 
     * @param {Integer} productId: id of the product  
     * @param {Integer} time: meeting time 
     * @param {Integer} adminId: id of the admin  
     * @returns an object of meeting details if exists, else null
     */
    findMeetingByTime: async (productId, time, adminId) => {
        try {
            return await models.Meeting.findOne({
                where: {
                    meetingProductId: productId,
                    meetingTime: time,
                    meetingAdminId: adminId,
                    isActive: true,
                }
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching a meeting by product id and time: ${error.message}`);
        }
    },

    /**
     * Function to fetch a record from table "meeting" by column 'adminId'
     * 
     * @param {Integer} adminId: id of the admin   
     * @returns an object of meeting details if exists, else null
     */
    findMeetingByAdminId: async (adminId) => {
        try {
            return await models.Meeting.findAll({
                where: {
                    meetingAdminId: adminId,
                    isActive: true,
                }
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching a meeting by admin id: ${error.message}`);
        }
    },

    /**
     * Function to fetch a record from table "meeting" by column 'id' and 'adminId'
     * 
     * @param {Integer} id: id of the meeting 
     * @param {Integer} adminId: id of the admin    
     * @returns an object of meeting details if exists, else null
     */
    findMeetingById: async (id, adminId) => {
        try {
            return await models.Meeting.findOne({
                where: {
                    id: id,
                    meetingAdminId: adminId,
                    isActive: true,
                }
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching a meeting by id: ${error.message}`);
        }
    },

    /**
     * Function to update a record in table "meeting" by column 'id'
     * 
     * @param {Object} meetingDetails: meeting details object 
     * @returns an array of updated meeting details, else an empty array
     */
    updateMeeting: async (meetingDetails) => {
        try {
            return await models.Meeting.update(meetingDetails, {
                where: {
                    id: meetingDetails.id,
                },
                returning: true,
            });
        } catch (error) {
            throw new Error(`Internal server error while updating a meeting by id: ${error.message}`);
        }
    }
};

module.exports = MeetingService;