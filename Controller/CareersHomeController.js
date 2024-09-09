const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addcareershome function
const addcareershome = async (req, res) => {
  const { lang } = req.params;
  const { title,count } = req.body;
  const icon =
    req.files && req.files["icon"] ? req.files["icon"][0].filename : null;
  if (!lang || !title || !count || !icon) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query =
    "INSERT INTO careershome (lang, title, count, icon) VALUES (?, ?, ?, ?)";

  db.query(query, [lang, title,count, icon], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "careershome added successfully",
      insertId: results.insertId,
    });
  });
};

const getcareershomeByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM careershome WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatecareershome = (req, res) => {
  const { lang, id } = req.params;
  const { title,count } = req.body;
  const icon =
    req.files && req.files["icon"] ? req.files["icon"][0].filename : null;
  // Ensure 'title,count' is a column in your table and not a dynamic field
  const sqlSelect = "SELECT title, count, icon FROM careershome WHERE lang = ? AND id = ?";
    
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
    const updatedCount= count !== undefined ? count : existing.count;
    const updatedIcon = icon !== null ? icon : existing.icon;
  const sqlUpdate =
  "UPDATE careershome SET title = ?, count = ?, icon = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [updatedTitle,  updatedCount, updatedIcon, lang, id], (err, result) => {
  if (err) {
    console.error("Error updating data:", err);
    return res.status(500).json({ message: err.message });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "No matching record found to update" });
  }

  res.status(200).json({ message: "careershome updated successfully" });
});
  })
};
const getcareershome = (req, res) => {
  const sqlSelect = "SELECT * FROM careershome";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getcareershomeById = (req, res) => {
    const { id } = req.params;
    const sqlSelect = "SELECT * FROM careershome WHERE id = ?";
    db.query(sqlSelect, [id], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
module.exports = { getcareershomeByLang, addcareershome, updatecareershome,getcareershome,getcareershomeById };
