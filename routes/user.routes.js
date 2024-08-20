const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth/authorize');
const UserController = require('../controllers/user.controllers');
const { USER_ROLE } = require('../enum/user');

router.post('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.inviteUser);
router.post('/login', UserController.userLogin);
router.post('/register', UserController.registerUser);

module.exports = router;