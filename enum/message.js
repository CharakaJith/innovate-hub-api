module.exports = {
    MESSAGE: ({
        INVALID_EMAIL: 'Invalid email address!',
        INVALID_ROLE: 'Invalid user role!',
        INVALID_TEAM: 'Invalid user team!',
        INVALID_MEETING: 'Invalid meeting time!',        
        EMPTY_FIELD: (fieldName) => `${fieldName} field is empty!`,

        ADMIN_ALREADY_REGISTERED: (email) => `Admin ${email} is already registered!`,

        PERMISSION_DENIED: 'Permission denied!',
        LOGIN_FAILED: 'Invalid email or password!',
        USER_DISABLED: 'User disabled!',
        INVALID_USER_ID: (id) => `Invalid user id ${id}!`,
        USER_ALREADY_INVITED: (email) => `User ${email} is already invited!`,
        USER_INACTIVE: (email) => `User ${email} is inactive!`,                
        USER_ALREADY_REGISTERED: (email) => `User ${email} is already registered!`,

        BRAND_ALREADY_SAVED: (brand) => `Brand ${brand} is already saved as a product!`,
        INVALID_PRODUCT_ID: (id) => `Invalid product id ${id}!`,

        MEETING_SCHEDULED: 'A meeting is already scheduled for this time!',
        MEETING_DISABLED: 'Meeting disabled!',
        INVALID_MEETING_ID: (id) => `Invalid meeting id ${id}!`
    }),
};