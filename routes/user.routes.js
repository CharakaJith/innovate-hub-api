const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth/authorize');
const UserController = require('../controllers/user.controller');
const { USER_ROLE } = require('../enum/user');

router.get('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.getAllUsers);
router.get('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MEMBER), UserController.getUserById);
router.post('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.inviteUser);
router.post('/login', UserController.userLogin);
router.post('/register', UserController.registerUser);
router.put('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MEMBER), UserController.updateUser);
router.delete('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), UserController.disableUser);

module.exports = router;