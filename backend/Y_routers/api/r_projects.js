const express = require('express');

const projectsCtrl = require('../../Z_controllers/c_projects');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.post('/new', projectsCtrl.postNewProject);
// router.post('/pause', logWorksCtrl.postPauseLog);
// router.post('/stop', logWorksCtrl.postStopLog);

// router.get('/customerLogs/:custId', logWorksCtrl.getCustomerProjects);
// router.get('/getLogs', logWorksCtrl.getLogs);

module.exports = router;
