const express = require('express');

const logWorksCtrl = require('../../Z_controllers/c_logWorks');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.post('/start', logWorksCtrl.postStartLog);
router.post('/pause', logWorksCtrl.postPauseLog);
router.post('/stop', logWorksCtrl.postStopLog);

router.get('/customerLogs/:custId', logWorksCtrl.getCustomerLogs);
router.get('/getLogs', logWorksCtrl.getLogs);

module.exports = router;
