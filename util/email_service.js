const mailgun = require('mailgun-js');
const logger = require('../middleware/logger/logger');
const { LOG_TYPE } = require('../enum/log');

const email_service = {
    send_user_invitation: async (email, admin) => {
        const data = {
            from: 'Mailgun Sandbox <postmaster@sandbox9214c2d4331b4df8a3dd3674aec2a5fb.mailgun.org>',
            to: email,
            subject: 'Invitation from InnovateHub',
            template: "user-invite",
            'h:X-Mailgun-Variables': JSON.stringify({
                admin: admin,  
                test: "test"
            })
        };

        await email_service.sendEmail(data);
    },

    sendEmail: async (data) => {
        try {
            const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});
            
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to send email: ${error.message}`);
        }
    }
};

module.exports = email_service;