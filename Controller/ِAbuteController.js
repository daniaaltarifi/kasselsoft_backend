const db = require("../config.js");
const fs = require("fs");
const path = require("path");




// Get About Page by Language
const getAboutByLang = (req, res) => {
    const { lang } = req.params;
    const sqlSelect = "SELECT * FROM about WHERE lang = ?";
    db.query(sqlSelect, [lang], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
  
  // Update About Page
  const updateAbout = (req, res) => {
    const { lang, id } = req.params;
    const { title, description, point1, point2, point3 } = req.body;
    
    const image1 = req.files && req.files['image1'] ? req.files['image1'][0].filename : null;
    const image2 = req.files && req.files['image2'] ? req.files['image2'][0].filename : null;
    const image3 = req.files && req.files['image3'] ? req.files['image3'][0].filename : null;
    const image4 = req.files && req.files['image4'] ? req.files['image4'][0].filename : null;
  
    const sqlSelect = "SELECT * FROM about WHERE lang = ? AND id = ?";
    
    db.query(sqlSelect, [lang, id], (err, results) => {
      if (err) {
        console.error("Error fetching current data:", err);
        return res.status(500).json({ message: err.message });
      }
    
      if (results.length === 0) {
        return res.status(404).json({ message: "No matching record found to update" });
      }
    
      const existing = results[0];
    
      const updatedTitle = title !== undefined ? title : existing.title;
      const updatedDescription = description !== undefined ? description : existing.description;
      const updatedpoint1 = point1 !== undefined ? point1 : existing.point1;
      const updatedpoint2 = point2 !== undefined ? point2 : existing.point2;
      const updatedpoint3 = point3 !== undefined ? point3 : existing.point3;
      const updatedImg1 = image1 !== null ? image1 : existing.image1;
      const updatedImg2 = image2 !== null ? image2 : existing.image2;
      const updatedImg3 = image3 !== null ? image3 : existing.image3;
      const updatedImg4 = image4 !== null ? image4 : existing.image4;
  
      const sqlUpdate = `
        UPDATE about 
        SET title = ?, description = ?, point1 = ?, point2 = ?, point3 = ?, 
            image1 = ?, image2 = ?, image3 = ?, image4 = ? 
        WHERE lang = ? AND id = ?
      `;
    
      db.query(sqlUpdate, 
        [updatedTitle, updatedDescription, updatedpoint1, updatedpoint2, updatedpoint3, updatedImg1, updatedImg2, updatedImg3, updatedImg4, lang, id],
        (err, result) => {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json({ message: err.message });
          }
    
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
          }
    
          res.status(200).json({ message: "About page updated successfully" });
        }
      );
    });
  };
  
  
  // Get All About Pages
  const getAbout = (req, res) => {
    const sqlSelect = "SELECT * FROM about";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
  
  module.exports = { getAboutByLang, updateAbout,getAbout};