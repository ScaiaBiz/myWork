const express = require('express');

const contactsCtrl = require('../../Z_controllers/c_contacts');
const isAuth = require('../../X_middelwares/is-auth');

const router = express.Router();

router.get('/contacts', contactsCtrl.getContacts);
router.post('/createContact', contactsCtrl.createContact);
router.get('/:id', contactsCtrl.getContact);
// router.post('/update', isAuth, contactsCtrl.updateActivity);

module.exports = router;
