const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addHomeServices function
const addHomeServices = async (req, res) => {
  const { lang } = req.params;
  const { key_name } = req.body;
  const img =
    req.files && req.files["value"] ? req.files["value"][0].filename : null;
  if (!lang || !key_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // If an image file is uploaded, use its path; otherwise, use the text value
  const value = img || req.body.value;

  if (!value) {
    return res.status(400).json({ error: "Missing value or image" });
  }

  const query =
    "INSERT INTO serviceshome (lang, key_name, value) VALUES (?, ?, ?)";

  db.query(query, [lang, key_name, value], (error, results) => {
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

const getHomeServicesByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM serviceshome WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updateHomeServices = (req, res) => {
  const { lang, id } = req.params;
  const { key_name } = req.body;
  const img =
    req.files && req.files["value"] ? req.files["value"][0].filename : null;

  const value = img || req.body.value;
if (!value) {
    return res.status(400).json({ error: "Missing value or image" });
  }
  // Ensure 'key_name' is a column in your table and not a dynamic field
  const sqlUpdate =
    "UPDATE serviceshome SET value = ? WHERE lang = ? AND id = ? AND key_name = ?";

  db.query(sqlUpdate, [value, lang, id, key_name], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      // No rows updated, likely because of a mismatch in the WHERE clause
      return res
        .status(404)
        .json({ message: "No matching record found to update" });
    }

    res.status(200).json({ message: "serviceshome updated successfully" });
  });
};
const getHomeServices= (req, res) => {
    const sqlSelect = "SELECT * FROM serviceshome";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
module.exports = { getHomeServicesByLang, addHomeServices, updateHomeServices,getHomeServices };
