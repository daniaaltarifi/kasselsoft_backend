const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addindustryimg function
const addindustryimg = async (req, res) => {
  const img =
    req.files && req.files["img"] ? req.files["img"][0].filename : null;
  if (!img) {
    return res.status(400).json({ error: "Missing required fields" });
  }
 
  const query =
    "INSERT INTO industryimg (img) VALUES (?)";

  db.query(query, [img], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: " img added successfully",
      insertId: results.insertId,
    });
  });
};


const updateindustryimg = (req, res) => {
  const {  id } = req.params;
  const img =
    req.files && req.files["img"] ? req.files["img"][0].filename : null;
    const sqlSelect = "SELECT img FROM industryimg WHERE id = ?";
    
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
    "UPDATE industryimg SET img = ? WHERE id = ? ";
  
  db.query(sqlUpdate, [updatedImg, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: err.message });
    }
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No matching record found to update" });
    }
  
    res.status(200).json({ message: "img updated successfully" });
  });
})
};
const getindustryimg = (req, res) => {
  const sqlSelect = "SELECT * FROM industryimg";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getindustryimgById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM industryimg WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports = { addindustryimg, updateindustryimg,getindustryimg,getindustryimgById };
