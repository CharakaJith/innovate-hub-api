const { USER_ROLE, USER_TEAM } = require('../enum/user');
const { MESSAGE } = require('../enum/message');

const field_validator = {
    check_empty_string: async (field, param, fieldName) => {
        if (!field || field.trim().length === 0) {
          return {
            field: param,
            message: MESSAGE.EMPTY_FIELD(fieldName),
          }
        }
  
        return 1;
    },

    check_empty_number: async (field, param, fieldName) => {
        if (!field) {
          return {
            field: param,
            message: MESSAGE.EMPTY_FIELD(fieldName),
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
            message: MESSAGE.INVALID_EMAIL,
          }
        }
  
        return 1;
    },

    check_role: async (role, param) => {
      const isValidRole = await field_validator.check_empty_string(role, param, 'User role');

      if (isValidRole != 1 || !Object.values(USER_ROLE).includes(role)) {
        return {
          field: param,
          message: MESSAGE.INVALID_ROLE,
        }
      }

      return 1;
    },

    check_team: async (team, param) => {
      const isValidTeam = await field_validator.check_empty_string(team, param, 'User team');

      if (isValidTeam != 1 || !Object.values(USER_TEAM).includes(team)) {
        return {
          field: param,
          message: MESSAGE.INVALID_TEAM,
        }
      }

      return 1;
    },

    check_date: async (date, param) => {
      const isValidDate = await field_validator.check_empty_string(date, param, 'Meeting time');

      const dateTime = new Date(date);

      if (isValidDate != 1 || isNaN(dateTime.getTime())) {
        return {
          field: param,
          message: MESSAGE.INVALID_MEETING,
        }
      }

      return 1;
    }
};

module.exports = field_validator;