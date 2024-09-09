const express = require('express');
const router= express.Router();
const ContactFooterController = require('../Controller/ContactFooterController.js');


router.post('/add/:lang', ContactFooterController.addcontactfooter);
router.get('/:lang', ContactFooterController.getcontactfooterByLang)
router.get('/getbyid/:id', ContactFooterController.getcontactfooterById)

router.get('/', ContactFooterController.getcontactfooter)
router.put('/update/:lang/:id', ContactFooterController.updatecontactfooter);


module.exports =router