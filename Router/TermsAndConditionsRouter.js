const express = require('express');
const router= express.Router();
const TermsAndConditionController = require('../Controller/TermsAndConditionsController.js');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Custom storage engine
const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // Destination folder
  },
  filename: (req, file, cb) => {
    // Generate the filename
    const filename = file.originalname;
    const filePath = path.join('images', filename);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // If file exists, return the existing filename
      cb(null, filename);
    } else {
      // If file doesn't exist, save it with the given filename
      cb(null, filename);
    }
  }
});

// Middleware to handle file upload
const upload = multer({
  storage: customStorage,
  fileFilter: (req, file, cb) => {
    // Optionally, you can filter file types if needed
    cb(null, true);
  }
});
// MAIN DATA
// router.post('/add/:lang/:page_type',upload.fields([{ name: 'img_Interpretation', maxCount: 1 }, { name: 'Severability_img', maxCount: 1 }]), TermsAndConditionController.addtermsandconditions);
router.get('/:lang', TermsAndConditionController.gettermsandconditionsByLang)
router.get('/:lang/:page_type', TermsAndConditionController.getTermsAndConditionsByPage)
router.get('/terms/getbyid/:id', TermsAndConditionController.gettermsandconditionsById)
// router.get('/', TermsAndConditionController.gettermsandconditions)
router.put('/update/:lang/:id',upload.fields([{ 
  name: 'img_Interpretation', maxCount: 1 }, { name: 'Severability_img', maxCount: 1 }]), TermsAndConditionController.updatetermsandconditions);

// BLACK DATA
router.post('/addblack/:lang', TermsAndConditionController.addtermsblackdata);
router.get('/black/get/:lang', TermsAndConditionController.gettermsblackdataByLang)
router.get('/black/:lang/:page_type', TermsAndConditionController.getTermsblackdataByPage)
router.get('/data/black/getbyid/:id', TermsAndConditionController.gettermsblackdataById)
router.get('/black', TermsAndConditionController.gettermsblackdata)
router.put('/black/update/:lang/:id', TermsAndConditionController.updatetermsblackdata);
router.delete('/black/delete/:lang/:id', TermsAndConditionController.deletetermsblackdata);
// BLUE DATA
router.post('/addblue/:lang', TermsAndConditionController.addtermsbluedata);
router.get('/blue/get/:lang', TermsAndConditionController.gettermsbluedataByLang)
router.get('/blue/:lang/:page_type', TermsAndConditionController.getTermsbluedataByPage)
router.get('/data/blue/getbyid/:id', TermsAndConditionController.gettermsbluedataById)
router.get('/blue', TermsAndConditionController.gettermsbluedata)
router.put('/blue/update/:lang/:id', TermsAndConditionController.updatetermsbluedata);
router.delete('/blue/delete/:lang/:id', TermsAndConditionController.deletetermsbluedata);


module.exports =router