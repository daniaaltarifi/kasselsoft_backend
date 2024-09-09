const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addbackgroundpath function
// const addbackgroundpath = async (req, res) => {
//   const { lang } = req.params;
//   const { title,subtitle } = req.body;
 

//   if (!title || !subtitle   ) {
//     return res.status(400).json({ error: "Missing value " });
//   }

//   const query =
//     "INSERT INTO backgroundpath (lang, title, subtitle) VALUES (?, ?, ?)";

//   db.query(query, [lang, title,subtitle], (error, results) => {
//     if (error) {
//       console.error("Error inserting data:", error);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.json({
//       message: "titles added successfully",
//       insertId: results.insertId,
//     });
//   });
// };

const getbackgroundpathByLang = (req, res) => {
  const { lang, path} = req.params;
  const sqlSelect = "SELECT * FROM backgroundpath WHERE lang = ? AND path = ?";
  db.query(sqlSelect, [lang,path], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatebackgroundpath = (req, res) => {
  const { lang, id } = req.params;
  const { title,subtitle, path } = req.body;
  const sqlSelect = "SELECT title, subtitle, path FROM backgroundpath WHERE lang = ? AND id = ?";
    
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
    const updatedsubTitle = subtitle !== undefined ? subtitle : existing.subtitle;
    const updatedPath= path !== undefined ? path : existing.path;

  const sqlUpdate =
  "UPDATE backgroundpath SET title = ?, subtitle = ?, path = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [updatedTitle, updatedsubTitle, updatedPath, lang, id], (err, result) => {
  if (err) {
    console.error("Error updating data:", err);
    return res.status(500).json({ message: err.message });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "No matching record found to update" });
  }

  res.status(200).json({ message: "backgroundpath updated successfully" });
});
  })
};
const getbackgroundpath = (req, res) => {
  const sqlSelect = "SELECT * FROM backgroundpath";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getbackgroundpathById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM backgroundpath WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports = { getbackgroundpathByLang, updatebackgroundpath,getbackgroundpath,getbackgroundpathById };
