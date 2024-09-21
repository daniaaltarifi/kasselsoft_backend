const express = require('express');
const router= express.Router();
const CareerFormController = require('../Controller/CareerFormController.js');
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

router.post('/add',upload.fields([{ name: 'cv', maxCount: 1 }]), CareerFormController.addcareerform);
router.get('/getbyid/:id', CareerFormController.getcareerformById)
router.get('/', CareerFormController.getcareerform)
router.get('/:filename', CareerFormController.getByFile);

router.put('/update/:id',upload.fields([{ name: 'cv', maxCount: 1 }]), CareerFormController.updatecareerform);
router.delete('/delete/:id', CareerFormController.deletecareerForm);


module.exports =router