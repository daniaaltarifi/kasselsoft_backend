const express = require('express');
const router= express.Router();
const CardHomeController = require('../Controller/CardHomeController.js');
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

router.post('/add/:lang',upload.fields([{ name: 'icon', maxCount: 1 }]), CardHomeController.addCardHome);
router.get('/:lang', CardHomeController.getCardHomeByLang)
router.get('/', CardHomeController.getCardHome)
router.put('/update/:lang/:id',upload.fields([{ name: 'icon', maxCount: 1 }]), CardHomeController.updateCardHome);


module.exports =router