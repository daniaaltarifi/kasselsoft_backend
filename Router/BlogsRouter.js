const express = require("express");
const router = express.Router();
const BlogsController = require("../Controller/BlogsController.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Custom storage engine
const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // Destination folder
  },
  filename: (req, file, cb) => {
    // Generate the filename
    const filename = file.originalname;
    const filePath = path.join("images", filename);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // If file exists, return the existing filename
      cb(null, filename);
    } else {
      // If file doesn't exist, save it with the given filename
      cb(null, filename);
    }
  },
});

// Middleware to handle file upload
const upload = multer({
  storage: customStorage,
  fileFilter: (req, file, cb) => {
    // Optionally, you can filter file types if needed
    cb(null, true);
  },
});

router.post(
  "/add/:lang",
  upload.fields([
    { name: "main_img", maxCount: 1 }, // Single main image
    { name: "descriptions[0][img]", maxCount: 10 },
    { name: "descriptions[1][img]", maxCount: 10 },
    { name: "descriptions[2][img]", maxCount: 10 },
    { name: "descriptions[3][img]", maxCount: 10 },
    { name: "descriptions[4][img]", maxCount: 10 },
    { name: "descriptions[5][img]", maxCount: 10 },
    { name: "descriptions[6][img]", maxCount: 10 },
    { name: "descriptions[7][img]", maxCount: 10 },
    { name: "descriptions[8][img]", maxCount: 10 },
    { name: "descriptions[9][img]", maxCount: 10 },
  ]),
  BlogsController.addblogs
);
router.get("/:lang", BlogsController.getblogsByLang);
router.get("/getbyid/:id", BlogsController.getblogsById);
router.get("/:lang/getbyid/:id", BlogsController.getblogsByIdAndLang);
router.get(
  "/:lang/getbyidfront/:id",
  BlogsController.getblogsByIdAndLangForFront
);
router.get("/", BlogsController.getblogs);
// router.get("/recentblog/:lang", BlogsController.getRecentBlog);
// router.put('/update/:lang/:id',upload.fields([{ name: 'img', maxCount: 1 }]), BlogsController.updateblogs);
router.put(
  "/update/:lang/:id",
  upload.fields([
    { name: "main_img", maxCount: 1 }, // Single main image
    { name: "descriptions[0][img]", maxCount: 10 },
    { name: "descriptions[1][img]", maxCount: 10 },
    { name: "descriptions[2][img]", maxCount: 10 },
    { name: "descriptions[3][img]", maxCount: 10 },
    { name: "descriptions[4][img]", maxCount: 10 },
    { name: "descriptions[5][img]", maxCount: 10 },
    { name: "descriptions[6][img]", maxCount: 10 },
    { name: "descriptions[7][img]", maxCount: 10 },
    { name: "descriptions[8][img]", maxCount: 10 },
    { name: "descriptions[9][img]", maxCount: 10 },
  ]),
  BlogsController.updateblogs
);
router.delete("/delete/:lang/:id", BlogsController.deleteblogs);
// description and img
router.delete("/deletedescr/:id", BlogsController.deleteDescriptionofBlog);
router.get("/paragraphs/:id", BlogsController.getDescriptionsandimg);
router.put("/paragraphs/update/:id", BlogsController.updateDescription);
router.put(
  "/paragraphsimg/update/:id",
  upload.fields([{ name: "img", maxCount: 1 }]),
  BlogsController.updateImg
);
router.delete("/deleteimg/:id", BlogsController.deleteimgblog);
router.post('/addimgblog/:blog_description_id', upload.fields([
  { name: "newimg", maxCount: 10 }]), BlogsController.addimgblog)

module.exports = router;
