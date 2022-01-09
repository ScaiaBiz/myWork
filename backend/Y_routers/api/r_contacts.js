const express = require('express');

const contactsCtrl = require('../../Z_controllers/c_contacts');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.get('/contacts', contactsCtrl.getContacts);
router.post('/createCustomer', contactsCtrl.createCustomer);
router.get('/customer/:id', contactsCtrl.getCustomer);
// router.post('/update', isAuth, contactsCtrl.updateActivity);

module.exports = router;
