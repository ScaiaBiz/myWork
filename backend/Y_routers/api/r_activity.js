const express = require('express');

const activityCtrl = require('../../Z_controllers/c_activity.js');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.get('/read', isAuth, activityCtrl.getActivity);
router.post('/write', activityCtrl.postNewActivity);
// router.post('/update', isAuth, activityCtrl.updateActivity);

module.exports = router;
