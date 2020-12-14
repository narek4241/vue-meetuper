const express = require('express');
const router = express.Router();

const MeetupsCtrl = require('../controllers/meetups');
const AuthCtrl = require('../controllers/auth');

router.get('', MeetupsCtrl.getMeetups);
router.get('/:id', MeetupsCtrl.getMeetupById);
router.get('/secret', AuthCtrl.onlyAuthUser, MeetupsCtrl.getSecret);
router.post('/', AuthCtrl.onlyAuthUser, MeetupsCtrl.createMeetup);
router.post('/:id/join', AuthCtrl.onlyAuthUser, MeetupsCtrl.joinMeetup);
router.post('/:id/leave', AuthCtrl.onlyAuthUser, MeetupsCtrl.leaveMeetup);

module.exports = router;
