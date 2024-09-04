const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addCardHome function
const addCardHome = async (req, res) => {
  const { lang } = req.params;
  const { title,description } = req.body;
  const icon =
    req.files && req.files["icon"] ? req.files["icon"][0].filename : null;
  if (!lang || !title || !description || !icon) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query =
    "INSERT INTO cardhome (lang, title, description, icon) VALUES (?, ?, ?, ?)";

  db.query(query, [lang, title,description, icon], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "cardhome added successfully",
      insertId: results.insertId,
    });
  });
};

const getCardHomeByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM cardhome WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updateCardHome = (req, res) => {
  const { lang, id } = req.params;
  const { title,description } = req.body;
  const icon =
    req.files && req.files["icon"] ? req.files["icon"][0].filename : null;
  // Ensure 'title,description' is a column in your table and not a dynamic field
  const sqlUpdate =
  "UPDATE cardhome SET title = ?, description = ?, icon = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [title,  description, icon, lang, id], (err, result) => {
  if (err) {
    console.error("Error updating data:", err);
    return res.status(500).json({ message: err.message });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "No matching record found to update" });
  }

  res.status(200).json({ message: "cardhome updated successfully" });
});

};
const getCardHome = (req, res) => {
  const sqlSelect = "SELECT * FROM cardhome";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports = { getCardHomeByLang, addCardHome, updateCardHome,getCardHome };
