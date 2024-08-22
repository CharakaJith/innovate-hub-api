const logger = require('../middleware/logger/logger');
const UserService = require('../services/user.service');
const field_validator = require('../util/field_validator');
const { USER_ROLE, USER_TEAM } = require('../enum/user');
const { LOG_TYPE } = require('../enum/log');

const TeamController = {
    getAllTeams: async (req, res) => {
        try {
            const admin = req.user;

            // get users
            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            const users = await UserService.findUsersByAdminId(adminId);

            // select active users
            const activeUsers = users.filter(user => user.isActive);

            // differentiate users into teams
            const usersByTeam = activeUsers.reduce((acc, user) => {
                if (!acc[user.userTeam]) {
                    acc[user.userTeam] = []; 
                }
                
                acc[user.userTeam].push(user);
                return acc;
            }, {});

            logger(LOG_TYPE.INFO, true, 200, `All teams fetched by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: usersByTeam
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to get all teams: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    getTeamByName: async (req, res) => {
        try {
            const team = req.params.team;
            const admin = req.user;

            // validate team
            const errorArray = [];
            errorArray.push(await field_validator.check_team(team, 'team'));

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger(LOG_TYPE.ERROR, false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            }

            // get users
            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            const users = await UserService.findUsersByAdminId(adminId);

            // select active users
            const activeUsers = users.filter(user => user.isActive);
            const userTeam = activeUsers.filter(user => user.userTeam == team);

            logger(LOG_TYPE.INFO, true, 200, `Team ${team} fetched by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: userTeam
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to get team by name: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
};

module.exports = TeamController;