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
  const sqlUpdate =
  "UPDATE whychooseus SET title = ?, subtitle = ?, description = ?, button = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [title, subtitle, description, button, lang, id], (err, result) => {
  if (err) {
    console.error("Error updating data:", err);
    return res.status(500).json({ message: err.message });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "No matching record found to update" });
  }

  res.status(200).json({ message: "whychooseus updated successfully" });
});

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
module.exports = { getWhychooseusByLang, addWhychooseus, updateWhychooseus,getWhychooseus };
