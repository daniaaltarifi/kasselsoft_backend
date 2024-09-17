const express = require('express');
const router= express.Router();
const AboutservicesController = require('../Controller/AboutServicesController'); 



// Route to update aboutteme data
router.put('/updateaboutServices/:lang/:id', AboutservicesController.updateaboutServices);
// Route to get aboutteme data by language
router.get('/getaboutServicesByLang/:lang', AboutservicesController.getaboutServicesByLang);

// Route to create a new aboutteme entry
router.post('/add/:lang', AboutservicesController.createaboutServices);

// Route to get all aboutteme data
router.get('/', AboutservicesController.getAllaboutServices);
router.get('/getbyid/:id', AboutservicesController.getAboutServiceById);
router.delete('/delete/:id', AboutservicesController.deleteAboutServiceById);

module.exports = router;