const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addexperiencehome function
const addexperiencehome = async (req, res) => {
  const { lang } = req.params;
  const { title,description } = req.body;
  const img =
    req.files && req.files["img"] ? req.files["img"][0].filename : null;
  if (!lang || !title || !description || !img) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query =
    "INSERT INTO experiencehome (lang, title, description, img) VALUES (?, ?, ?, ?)";

  db.query(query, [lang, title,description, img], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "experiencehome added successfully",
      insertId: results.insertId,
    });
  });
};

const getexperiencehomeByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM experiencehome WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updateexperiencehome = (req, res) => {
    const { lang, id } = req.params;
    const { title, description } = req.body;
    const img =
      req.files && req.files["img"] ? req.files["img"][0].filename : null;
  
    // First, retrieve the current values
    const sqlSelect = "SELECT title, description, img FROM experiencehome WHERE lang = ? AND id = ?";
    
    db.query(sqlSelect, [lang, id], (err, results) => {
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
      const updatedTitle = title !== undefined ? title : existing.title;
      const updatedDescription = description !== undefined ? description : existing.description;
      const updatedImg = img !== null ? img : existing.img;
  
      // Construct the update SQL query
      const sqlUpdate = "UPDATE experiencehome SET title = ?, description = ?, img = ? WHERE lang = ? AND id = ?";
      
      db.query(sqlUpdate, [updatedTitle, updatedDescription, updatedImg, lang, id], (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).json({ message: err.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "No matching record found to update" });
        }
  
        res.status(200).json({ message: "experiencehome updated successfully" });
      });
    });
  };
  

const getexperiencehome = (req, res) => {
  const sqlSelect = "SELECT * FROM experiencehome";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getexperiencehomeById = (req, res) => {
    const { id } = req.params;
    const sqlSelect = "SELECT * FROM experiencehome WHERE id = ?";
    db.query(sqlSelect, [id], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
module.exports = { getexperiencehomeByLang, addexperiencehome, updateexperiencehome,getexperiencehome,getexperiencehomeById };
