const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addImgSliderHome function
const addImgSliderHome = async (req, res) => {
//   const { lang } = req.params;
  const img =
    req.files && req.files["slider"] ? req.files["slider"][0].filename : null;
  if (!img) {
    return res.status(400).json({ error: "Missing required fields" });
  }
 
  const query =
    "INSERT INTO imgsliderhome (img) VALUES (?)";

  db.query(query, [img], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "slider img added successfully",
      insertId: results.insertId,
    });
  });
};

// const getImgSliderHomeByLang = (req, res) => {
//   const { lang } = req.params;
//   const sqlSelect = "SELECT * FROM imgsliderhome WHERE lang = ?";
//   db.query(sqlSelect, [lang], (err, result) => {
//     if (err) {
//       return res.json({ message: err.message });
//     }
//     res.status(200).json(result);
//   });
// };
const updateImgSliderHome = (req, res) => {
  const {  id } = req.params;
  const img =
    req.files && req.files["slider"] ? req.files["slider"][0].filename : null;

    const sqlUpdate =
    "UPDATE imgsliderhome SET img = ? WHERE id = ? ";
  
  db.query(sqlUpdate, [img, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: err.message });
    }
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No matching record found to update" });
    }
  
    res.status(200).json({ message: "titleshome updated successfully" });
  });
  
};
const getImgSliderHome = (req, res) => {
  const sqlSelect = "SELECT * FROM imgsliderhome";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports = { addImgSliderHome, updateImgSliderHome,getImgSliderHome };
