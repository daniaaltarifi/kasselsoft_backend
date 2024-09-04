const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

const fs = require("fs");
dotenv.config();
const db = require("./config.js");
const HomeRouter = require("./Router/HomeRouter.js");
const HomeServicesRouter = require("./Router/HomeServicesRouter.js");
const WhyChooseusRouter = require("./Router/WhyChooseusRouter.js");
const CardHomeRouter = require("./Router/CardHomeRouter.js");
const TitlesHomeRouter = require("./Router/TitlesHomeRouter.js");
const ImgSliderHomeRouter = require("./Router/ImgSliderRouter.js");
const app = express();
const PORT = process.env.PORT || 3005;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("images"));
app.use("/home", HomeRouter);
app.use("/homeservices", HomeServicesRouter);
app.use("/homewhychooseus", WhyChooseusRouter);
app.use("/cardhome", CardHomeRouter);
app.use("/titleshome", TitlesHomeRouter);
app.use("/imgsliderhome", ImgSliderHomeRouter);
// app.get("/translations/:lang", (req, res) => {
//   const lang = req.params.lang;
//   const filePath =  path.join(
//     __dirname,
//     "translations",
//     `${lang.split("-")[0]}.json`
//   );
//   fs.readFile(filePath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(404).json({ error: "translation file not found" });
//     }
//     try {
//       const jsonData = JSON.parse(data);
//       res.set("Cache-control", "public, max-age=3600");
//       res.json(jsonData);
//     } catch (parseError) {
//       res.status(500).json({ error: "error parsing translation" });
//     }
//   });
// });
// Route to handle POST requests for inserting new data


// Function to update the translation
// const updateTranslation = (lang, keyName, newValue) => {
//   const query = 'UPDATE translationhome SET value_ar = ? WHERE lang = ? AND key_name = ?';
//   const values = [newValue, lang, keyName];

//   db.query(query, values, (error, results) => {
//       if (error) {
//           console.error('Error updating translation:', error);
//           return;
//       }
//       console.log('Translation updated successfully.');
//   });
// };

// // Example usage
// updateTranslation('ar', 'title', 'أهلاً وسهلاً بكم في موقعنا');


// app.put('/translations/:lang', (req, res) => {
//     const lang = req.params.lang; // Language code, e.g., "en" or "ar"
//     const newData = req.body; // { "home.title": "Welcome", "home.subtitle": "Subtitle" }
  
//     // Create an array of promises to handle multiple key-value pairs
//     const promises = Object.entries(newData).map(([key, value]) => {
//       return new Promise((resolve, reject) => {
//         db.query(
//           `INSERT INTO translationhome (lang, \`key\`, value) VALUES (?, ?, ?)
//            ON DUPLICATE KEY UPDATE value = VALUES(value)`,
//           [lang, key, value],
//           (err, result) => {
//             if (err) {
//               console.error('Error executing query:', err);
//               reject(err);
//             } else {
//               resolve(result);
//             }
//           }
//         );
//       });
//     });
  
//     // Handle all promises
//     Promise.all(promises)
//       .then(results => {
//         res.json({ message: 'Translations updated successfully' });
//       })
//       .catch(error => {
//         console.error('Error updating translations:', error);
//         res.status(500).json({ error: 'Error updating translations' });
//       });
//   });
  
// app.put("/translations/:lang", (req, res) => {
//     const lang = req.params.lang;
//     const filePath = path.join(__dirname, "translations", `${lang.split("-")[0]}.json`);
//     const newData = req.body;
  
//     // Read the existing file
//     fs.readFile(filePath, "utf-8", (err, data) => {
//       if (err) {
//         return res.status(404).json({ error: "translation file not found" });
//       }
  
//       try {
//         // Parse the existing file data
//         const jsonData = JSON.parse(data);
  
//         // Update the JSON data with new data
//         const updatedData = { ...jsonData, ...newData };
  
//         // Write the updated data back to the file
//         fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), "utf-8", (writeErr) => {
//           if (writeErr) {
//             return res.status(500).json({ error: "error writing translation file" });
//           }
//           res.json({ message: "translation updated successfully" });
//         });
//       } catch (parseError) {
//         res.status(500).json({ error: "error parsing translation" });
//       }
//     });
//   });
app.get("/", (req, res) => {
  res.send("Welcome to kasselsoft! ");
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
