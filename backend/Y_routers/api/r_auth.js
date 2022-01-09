const express = require('express');

const authCtrl = require('../../Z_controllers/c_auth');
const isAuth = require('../../X_middelwares/is-auth');
const isAdmin = require('../../X_middelwares/is-admin');

const router = express.Router();

// router.get('/login', authCtrl.postLogin);
router.post('/login', authCtrl.postLogin);
router.post('/logout', authCtrl.postLogout);
router.post('/signin', authCtrl.postNewUser);

module.exports = router;
