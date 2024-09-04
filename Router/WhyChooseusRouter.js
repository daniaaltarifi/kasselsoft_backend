const express = require('express');
const router= express.Router();
const WhyChooseusController = require('../Controller/WhyChooseusController.js');


router.post('/add/:lang', WhyChooseusController.addWhychooseus);
router.get('/:lang', WhyChooseusController.getWhychooseusByLang)
router.get('/', WhyChooseusController.getWhychooseus)
router.put('/update/:lang/:id', WhyChooseusController.updateWhychooseus);


module.exports =router