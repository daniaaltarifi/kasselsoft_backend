const express = require('express');
const router= express.Router();
const ExperienceHomeController = require('../Controller/ExperienceHomeController.js');
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

router.post('/add/:lang',upload.fields([{ name: 'img', maxCount: 1 }]), ExperienceHomeController.addexperiencehome);
router.get('/:lang', ExperienceHomeController.getexperiencehomeByLang)
router.get('/getbyid/:id', ExperienceHomeController.getexperiencehomeById)
router.get('/', ExperienceHomeController.getexperiencehome)
router.put('/update/:lang/:id',upload.fields([{ name: 'img', maxCount: 1 }]), ExperienceHomeController.updateexperiencehome);
router.delete('/delete/:id',ExperienceHomeController.deleteExperienceHome)


module.exports =router