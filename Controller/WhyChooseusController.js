const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addWhychooseus function
const addWhychooseus = async (req, res) => {
  const { lang } = req.params;
  const { title,subtitle,description,button } = req.body;
 

  if (!title || !subtitle || !description || !button ) {
    return res.status(400).json({ error: "Missing value " });
  }

  const query =
    "INSERT INTO whychooseus (lang, title, subtitle, description, button) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [lang, title,subtitle,description,button], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "Translation added successfully",
      insertId: results.insertId,
    });
  });
};

const getWhychooseusByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM whychooseus WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updateWhychooseus = (req, res) => {
  const { lang, id } = req.params;
  const { title,subtitle,description,button } = req.body;
  const sqlSelect = "SELECT title, subtitle, description, button FROM whychooseus WHERE lang = ? AND id = ?";
    
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
    const updatedSubtitle = subtitle !== undefined ? subtitle : existing.subtitle;
    const updatedDescription = description !== undefined ? description : existing.description;
    const updatedButton = button !== undefined ? button : existing.button;

  const sqlUpdate =
  "UPDATE whychooseus SET title = ?, subtitle = ?, description = ?, button = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [updatedTitle, updatedSubtitle, updatedDescription, updatedButton, lang, id], (err, result) => {
  if (err) {
    console.error("Error updating data:", err);
    return res.status(500).json({ message: err.message });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "No matching record found to update" });
  }

  res.status(200).json({ message: "whychooseus updated successfully" });
});
  })
};
const getWhychooseus = (req, res) => {
  const sqlSelect = "SELECT * FROM whychooseus";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getwhychooseusshomeById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM whychooseus WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports = { getWhychooseusByLang, addWhychooseus, updateWhychooseus,getWhychooseus,getwhychooseusshomeById };
