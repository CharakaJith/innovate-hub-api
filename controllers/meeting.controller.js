const logger = require('../middleware/logger/logger');
const ProductService = require('../services/product.service');
const MeetingService = require('../services/meeting.service');
const field_validator = require('../util/field_validator');
const { LOG_TYPE } = require('../enum/log');
const { MESSAGE } = require('../enum/message');
const { USER_ROLE } = require('../enum/user');

const MeetingController = {
    getAllMeeting: async (req, res) => {
        try {
            const admin = req.user;

            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            const meetings = await MeetingService.findMeetingByAdminId(adminId);
            let products = await ProductService.findAllProductsByAdminId(adminId);

            // validate user accesibility
            const userProducts = [];
            if (admin.role == USER_ROLE.MEMBER) {
                for (const product of products) {
                    for (const member of product.productMembers) {
                        if (member.productMemberId === admin.id) {
                            userProducts.push(product);
                        }
                    }
                }
            }
            products = userProducts.length != 0 ? userProducts : products;

            const meetingWithProduct = await Promise.all(meetings.map(async (meeting) => {
                const product = products.find(product => product.id === meeting.meetingProductId);
            
                const meetingIn = await getTimeDifference(meeting.meetingTime);
            
                return {
                    meeting,
                    meetingIn,
                    product,
                };
            }));

            logger(LOG_TYPE.INFO, true, 200, `All meetings fetched by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: meetingWithProduct
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to fetch all meetings: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    getMeetingById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const admin = req.user;

            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            let products = await ProductService.findAllProductsByAdminId(adminId);
            const meeting = await MeetingService.findMeetingById(id, adminId);
            if (!meeting) {
                throw new Error(MESSAGE.INVALID_MEETING_ID(id));
            }

            // validate user accesibility
            const userProducts = [];
            if (admin.role == USER_ROLE.MEMBER) {
                for (const product of products) {
                    for (const member of product.productMembers) {
                        if (member.productMemberId === admin.id) {
                            userProducts.push(product);
                        }
                    }
                }
            }
            if (admin.role == USER_ROLE.MEMBER && userProducts.length == 0)  {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            return res.status(200).json({
                success: true,
                message: meeting
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to fetch meeting by id: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    scheduleMeeting: async (req, res) => {
        try {
            const { productId, time } = req.body;
            const admin = req.user;

            // validate user inputs
            const errorArray = [];
            errorArray.push(await field_validator.check_empty_number(productId, 'productId', 'Product id'));
            errorArray.push(await field_validator.check_date(time, 'time'));

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger(LOG_TYPE.ERROR, false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            } 

            // validate product
            const product = await ProductService.findProductById(productId);
            if (!product) {
                throw new Error(MESSAGE.INVALID_PRODUCT_ID(productId));
            }
            if(product.productAdminId != admin.id && product.productAdminId != admin.adminId) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // validate date time
            const meetingTime = new Date(time);
            const currentTime = new Date();
            if (meetingTime < currentTime) {
                throw new Error(MESSAGE.INVALID_MEETING);
            }

            // validate meeting
            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            const plannedMeeting = await MeetingService.findMeetingByTime(productId, time, adminId);
            if (plannedMeeting) {
                throw new Error(MESSAGE.MEETING_SCHEDULED);
            }

            // create new meeting
            const meetingDetails = {
                meetingProductId: product.id,
                meetingTime: meetingTime,
                meetingAdminId: adminId,
                isActive: true,
            };
            const newMeeting = await MeetingService.createNewMeeting(meetingDetails);

            const meetingIn = await getTimeDifference(newMeeting.meetingTime);

            logger(LOG_TYPE.INFO, true, 200, `New meeting ${newMeeting.id} scheduled by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: {
                    meeting: newMeeting,
                    meetingIn: meetingIn
                }
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to schedule a meeting: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    updateMeeting: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { productId, time } = req.body;
            const admin = req.user;

            // validate user inputs
            const errorArray = [];
            errorArray.push(await field_validator.check_empty_number(productId, 'productId', 'Product id'));
            errorArray.push(await field_validator.check_date(time, 'time'));

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger(LOG_TYPE.ERROR, false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            } 

            // validate product
            const product = await ProductService.findProductById(productId);
            if (!product) {
                throw new Error(MESSAGE.INVALID_PRODUCT_ID(productId));
            }
            if(product.productAdminId != admin.id && product.productAdminId != admin.adminId) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // validate date time
            const meetingTime = new Date(time);
            const currentTime = new Date();
            if (meetingTime < currentTime) {
                throw new Error(MESSAGE.INVALID_MEETING);
            }

            // validate meeting
            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            const plannedMeeting = await MeetingService.findMeetingByTime(productId, time, adminId);
            if (plannedMeeting) {
                throw new Error(MESSAGE.MEETING_SCHEDULED);
            }

            // update meeting
            const meetingDetails = {
                id: id,
                meetingProductId: productId,
                meetingTime: time,
            };
            const updatedMeeting = await MeetingService.updateMeeting(meetingDetails);

            const meetingIn = await getTimeDifference(updatedMeeting[1][0].meetingTime);

            logger(LOG_TYPE.INFO, true, 200, `Meeting ${id} updated by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: {
                    meeting: updatedMeeting[1][0],
                    meetingIn: meetingIn,
                }
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to update the meeting: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    disbaleMeeting: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const admin = req.user;

            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            const meeting = await MeetingService.findMeetingById(id, adminId);
            if (!meeting) {
                throw new Error(MESSAGE.INVALID_MEETING_ID(id));
            }

            // disable meeting
            const meetingDetails = {
                id: meeting.id,
                isActive: false,
            };
            await MeetingService.updateMeeting(meetingDetails);
            
            logger(LOG_TYPE.INFO, true, 200, `Meeting ${meeting.id} disabled by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: MESSAGE.MEETING_DISABLED,
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to disable the meeting: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
};

const getTimeDifference = async (dateTime) => {
    const meetingTime = new Date(dateTime);
    const currentTime = new Date();

    const diffInMillis = meetingTime - currentTime;
    const diffInMinutes = Math.floor(diffInMillis / 60000);
    const diffInHours = Math.floor(diffInMillis / (60000 * 60));
    const diffInDays = Math.floor(diffInMillis / (60000 * 60 * 24));
    const diffInMonths = meetingTime.getMonth() - currentTime.getMonth() + (12 * (meetingTime.getFullYear() - currentTime.getFullYear()));

    if (diffInDays === 0) { 
        if (diffInMinutes < 60) {
            return `In ${diffInMinutes} minutes`;
        } else {
            return `In ${diffInHours} hours`;
        }
    } else if (diffInDays === 1) { 
        return "Tomorrow";
    } else if (diffInMonths === 0) { 
        return `in ${diffInDays} days`;
    } else if (diffInMonths === 1) { 
        return "Next month";
    } else { 
        return meetingTime.toLocaleDateString(); 
    }
}

module.exports = MeetingController;