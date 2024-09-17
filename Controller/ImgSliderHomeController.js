const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addImgSliderHome function
const addImgSliderHome = async (req, res) => {
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


const updateImgSliderHome = (req, res) => {
  const {  id } = req.params;
  const img =
    req.files && req.files["slider"] ? req.files["slider"][0].filename : null;
    const sqlSelect = "SELECT img FROM imgsliderhome WHERE id = ?";
    
    db.query(sqlSelect, [id], (err, results) => {
      if (err) {
        console.error("Error fetching current data:", err);
        return res.status(500).json({ message: err.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No matching record found to update" });
      }
  
      // Get existing values
      const existing = results[0];
  
      // Update fields only if new values are provided
      
      const updatedImg = img !== null ? img : existing.img;
    const sqlUpdate =
    "UPDATE imgsliderhome SET img = ? WHERE id = ? ";
  
  db.query(sqlUpdate, [updatedImg, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: err.message });
    }
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No matching record found to update" });
    }
  
    res.status(200).json({ message: "slider updated successfully" });
  });
})
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
const getImgSliderHomeById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM imgsliderhome WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const deleteImgSliderHome = (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM imgsliderhome WHERE id = ? ";
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No matching record found to delete" });
    }
    res.status(200).json({ message: "slider deleted successfully" });
  });
}
module.exports = { addImgSliderHome, updateImgSliderHome,getImgSliderHome,getImgSliderHomeById, deleteImgSliderHome };
