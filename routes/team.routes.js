const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth/authorize');
const TeamController = require('../controllers/team.controller');
const { USER_ROLE } = require('../enum/user');

router.get('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), TeamController.getAllTeams);
router.get('/:team', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), TeamController.getTeamByName);

module.exports = router;