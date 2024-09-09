const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// // Updated addHome function


// Updated addmainhome function
const addmainhome = async (req, res) => {
  try {
    const { lang } = req.params;
    const { title, subtitle, description, button } = req.body;

    // Check for file upload
    const img = req.files && req.files["img"] ? req.files["img"][0].filename : null;

    // Validate required fields
    if (!lang || !title || !description || !img) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert data into the database
    const query = "INSERT INTO mainhome (lang, title, subtitle, description, button, img) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [lang, title, subtitle, description, button, img], (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "mainhome added successfully",
        insertId: results.insertId,
      });
    });
  } catch (error) {
    console.error("Error in addmainhome:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getmainhomeByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM mainhome WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatemainhome = (req, res) => {
  const { lang, id } = req.params;
  const { title, subtitle, description, button } = req.body;
  const img =
    req.files && req.files["img"] ? req.files["img"][0].filename : null;

  // First, retrieve the current values
  const sqlSelect = "SELECT title, subtitle, description, button, img FROM mainhome WHERE lang = ? AND id = ?";
  
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
    const updatedSubTitle = subtitle !== undefined ? subtitle : existing.subtitle;
    const updatedDescription = description !== undefined ? description : existing.description;
    const updatedButton = button !== undefined ? button : existing.button;
    const updatedImg = img !== null ? img : existing.img;

    // Construct the update SQL query
    const sqlUpdate = "UPDATE mainhome SET title = ?, subtitle = ?, description = ?, button = ?, img = ? WHERE lang = ? AND id = ?";
    
    db.query(sqlUpdate, [updatedTitle, updatedSubTitle, updatedDescription, updatedButton, updatedImg, lang, id], (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No matching record found to update" });
      }

      res.status(200).json({ message: "mainhome updated successfully" });
    });
  });
};

  

const getmainhome = (req, res) => {
  const sqlSelect = "SELECT * FROM mainhome";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getmainhomeById = (req, res) => {
    const { id } = req.params;
    const sqlSelect = "SELECT * FROM mainhome WHERE id = ?";
    db.query(sqlSelect, [id], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
module.exports = { getmainhomeByLang, addmainhome, updatemainhome,getmainhome,getmainhomeById };

