const jwt = require('jsonwebtoken');

const jwt_service = {
    generate_access_token: async (tokenUser) => {
        try {
            return jwt.sign({ tokenUser }, process.env.JWT_SECRET, {
              expiresIn: '24h',
            });
          } catch (error) {
            throw new Error(`Internal server error while trying to generate an access token: ${error.message}`);
          }
    }
};

module.exports = jwt_service;