const express = require('express');

const logWorksCtrl = require('../../Z_controllers/c_logWorks');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.post('/newLog', logWorksCtrl.postNewLog);
router.post('/start', logWorksCtrl.postStartLog);
router.post('/pause', logWorksCtrl.postPauseLog);
router.post('/stop', logWorksCtrl.postStopLog);

router.get('/customerLogs/:custId', logWorksCtrl.getCustomerLogs);
router.get('/logs/:projectId', logWorksCtrl.getProjectsLogs);
router.get('/getLogs', logWorksCtrl.getLogs);

router.get('/getDailyPlan/:day', logWorksCtrl.getDailyPlan);

module.exports = router;
