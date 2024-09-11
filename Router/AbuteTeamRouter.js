const express = require('express');
const router= express.Router();
const AboutTemeController = require('../Controller/AbuteTeamController'); 



// Route to get aboutteme data by language
router.get('/aboutteme/:lang', AboutTemeController.getAboutTemeByLang);

// Route to update aboutteme data
router.put('/update/:lang/:id', AboutTemeController.updateAboutTeme);

// Route to create a new aboutteme entry
router.post('/aboutteme/:lang', AboutTemeController.createAboutTeme);

// Route to get all aboutteme data
router.get('/', AboutTemeController.getAllAboutTeme);

module.exports = router;