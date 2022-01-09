const express = require('express');

const adminCtrl = require('../../Z_controllers/c_admin');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.get('/', isAuth, adminCtrl.getSettings);
router.post('/', isAuth, adminCtrl.postSettings);

module.exports = router;
