const field_validator = {
    check_empty_string: async (field, param, fieldName) => {
        if (!field || field.trim().length === 0) {
          return {
            field: param,
            message: `${fieldName} field is empty!`,
          }
        }
  
        return 1;
    },

    check_email: async (email, param) => {
        const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
        const isValidEmail = await field_validator.check_empty_string(email, param, 'email address');
  
        if (isValidEmail != 1 || !String(email).match(emailformat)) {
          return {
            field: param,
            message: `Invalid email address!`,
          }
        }
  
        return 1;
    },
};

module.exports = field_validator;