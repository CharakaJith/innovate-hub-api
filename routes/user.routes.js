const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controllers');

router.post('/', UserController.inviteUser);
router.post('/login', UserController.userLogin);

module.exports = router;