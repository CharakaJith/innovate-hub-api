const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth/authorize');
const MeetingController = require('../controllers/meeting.controller');
const { USER_ROLE } = require('../enum/user');

router.get('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MEMBER), MeetingController.getAllMeeting);
router.get('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MEMBER), MeetingController.getMeetingById);
router.post('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), MeetingController.scheduleMeeting);
router.put('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), MeetingController.updateMeeting);
router.delete('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), MeetingController.disbaleMeeting);

module.exports = router;