const express = require('express');
const router = express.Router();
const AboutController = require('../Controller/AboutusController'); 
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Custom storage engine for multer
const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // Destination folder
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    const filePath = path.join('images', filename);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // If the file exists, use the existing filename
      cb(null, filename);
    } else {
      // Otherwise, save with the given filename
      cb(null, filename);
    }
  }
});

// Middleware to handle file uploads
const upload = multer({
  storage: customStorage,
  fileFilter: (req, file, cb) => {
    // Optionally filter file types here
    cb(null, true);
  }
});

// Define routes

// Route to get about page data by language (No file upload required for GET requests)
router.get('/about/:lang', AboutController.getAboutByLang);
router.get('/aboutbyid/:id', AboutController.getaboutById);

// Route to update about page (Upload multiple images if provided)
router.put('/update/:lang/:id', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]),

  (req, res, next) => {
    console.log('PUT request received for ID:', req.params.id);
    console.log('Files received:', req.files);
    console.log('Body:', req.body);
    next();
  }, AboutController.updateAbout);

// Route to get all about page data (No file upload required for GET requests)
router.get('/about', AboutController.getAbout);
router.post('/add/:lang', 
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
  ]), 
  (req, res, next) => {
    console.log('POST request to add about page received.');
    next();
  }, AboutController.addAbout);

module.exports = router;
