const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addTitlesHome function
const addTitlesHome = async (req, res) => {
  const { lang } = req.params;
  const { title,subtitle,description } = req.body;
 

  if (!title || !subtitle || !description  ) {
    return res.status(400).json({ error: "Missing value " });
  }

  const query =
    "INSERT INTO titleshome (lang, title, subtitle, description) VALUES (?, ?, ?, ?)";

  db.query(query, [lang, title,subtitle,description], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "titles added successfully",
      insertId: results.insertId,
    });
  });
};

const getTitlesHomeByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM titleshome WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updateTitleshome = (req, res) => {
  const { lang, id } = req.params;
  const { title,subtitle,description } = req.body;
  const sqlUpdate =
  "UPDATE titleshome SET title = ?, subtitle = ?, description = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [title, subtitle, description, lang, id], (err, result) => {
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
const getTitleshome = (req, res) => {
  const sqlSelect = "SELECT * FROM titleshome";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports = { getTitlesHomeByLang, addTitlesHome, updateTitleshome,getTitleshome };
