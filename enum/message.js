module.exports = {
    MESSAGE: ({
        ADMIN_ALREADY_REGISTERED: (email) => `Admin ${email} is already registered!`,

        PERMISSION_DENIED: 'Permission denied!',
        LOGIN_FAILED: 'Invalid email or password!',
        INVALID_USER_ID: (id) => `Invalid user id ${id}!`,
        USER_ALREADY_INVITED: (email) => `User ${email} is already invited!`,
        USER_INACTIVE: (email) => `User ${email} is inactive!`,                
        USER_ALREADY_REGISTERED: (email) => `User ${email} is already registered!`,

        BRAND_ALREADY_SAVED: (brand) => `Brand ${brand} is already saved as a product!`,
        INVALID_PRODUCT_ID: (id) => `Invalid product id ${id}!`,
    }),
};