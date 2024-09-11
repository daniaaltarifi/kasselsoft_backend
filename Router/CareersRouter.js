const express = require('express');
const router= express.Router();
const CareersController = require('../Controller/CareersController.js');


router.post('/add/:lang', CareersController.addcareers);
router.get('/:lang', CareersController.getcareersByLang)
router.get('/:lang/getbyid/:id', CareersController.getcareersById)

router.get('/', CareersController.getcareers)
router.put('/update/:lang/:id', CareersController.updatecareers);
router.delete('/delete/:lang/:id', CareersController.deletecareers);


module.exports =router