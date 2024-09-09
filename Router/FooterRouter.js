const express = require('express');
const router= express.Router();
const FooterController = require('../Controller/FooterController.js');


router.post('/add/:lang', FooterController.addFooter);
router.get('/:lang', FooterController.getfooterByLang)
router.get('/getbyid/:id', FooterController.getfooterById)

router.get('/', FooterController.getfooter)
router.put('/update/:lang/:id', FooterController.updatefooter);


module.exports =router