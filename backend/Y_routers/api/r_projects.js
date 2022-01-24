const express = require('express');

const projectsCtrl = require('../../Z_controllers/c_projects');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.get('/getProjects/:contactId', projectsCtrl.getContactProjects);
router.post('/newProject', projectsCtrl.postNewProject);
// router.post('/updateProject', projectsCtrl.postNewProject);

module.exports = router;
