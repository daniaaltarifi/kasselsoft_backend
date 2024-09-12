const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addTags function
const addTags = async (req, res) => {
    const { lang } = req.params;

    const { tag_name } = req.body;
  
    // Validate input
    if (!lang || !tag_name) {
      return res.status(400).json({ error: "Missing value" });
    }
  
    // SQL query with correct syntax
    const query = "INSERT INTO tags (lang, tag_name) VALUES (?, ?)";
  
    // Use parameterized query to prevent SQL injection
    db.query(query, [lang, tag_name], (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Database error" });
      }
  
      res.json({
        message: "Tags added successfully",
        insertId: results.insertId,
      });
    });
  };
  

const updateTags = (req, res) => {
    const { lang,id} = req.params;
    const { tag_name } = req.body;
  
    // Query to select the current data
    const sqlSelect = "SELECT tag_name FROM tags WHERE lang = ? AND id = ?";
      
    db.query(sqlSelect, [lang, id], (err, results) => {
      if (err) {
        console.error("Error fetching current data:", err);
        return res.status(500).json({ message: err.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No matching record found to update" });
      }
  
      // Get existing value
      const existing = results[0].tag_name;
  
      // Update field only if new value is provided
      const updatedTags = tag_name !== undefined ? tag_name : existing;
      
      if (updatedTags === existing) {
        return res.status(400).json({ message: "No change in Tags name" });
      }
  
      // Correct SQL query syntax for update
      const sqlUpdate = "UPDATE tags SET tag_name = ? WHERE lang = ? AND id = ?";
  
      db.query(sqlUpdate, [updatedTags, lang, id], (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).json({ message: err.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "No matching record found to update" });
        }
  
        res.status(200).json({ message: "Tags updated successfully" });
      });
    });
  };
  
const getTags = (req, res) => {
  const sqlSelect = "SELECT * FROM tags";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getTagsByLang = (req, res) => {
    const { lang } = req.params;
    const sqlSelect = "SELECT * FROM tags WHERE lang = ?";
    db.query(sqlSelect, [lang], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
const getTagsById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM tags WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const deleteTags = (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM tags WHERE id = ?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json("Deleted successfully");

})
}
module.exports = { addTags, updateTags,getTags,getTagsById,deleteTags ,getTagsByLang};
