const express = require('express');
const router= express.Router();
const ContactFormController = require('../Controller/ContactFormController');


router.post('/add', ContactFormController.addcontactform);
router.get('/getbyid/:id', ContactFormController.getcontactform)
router.get('/', ContactFormController.getcontactform)

router.delete('/delete/:id', ContactFormController.deletecontactForm);


module.exports =router