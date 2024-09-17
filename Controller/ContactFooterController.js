const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addcontactfooter function
const addcontactfooter = async (req, res) => {
  const { lang } = req.params;
  const { title,subtitle,link } = req.body;
 


  const query =
    "INSERT INTO contactfooter (lang, title, subtitle, link) VALUES (?, ?, ?, ?)";

  db.query(query, [lang, title,subtitle,link], (error, results) => {
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

const getcontactfooterByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM contactfooter WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatecontactfooter = (req, res) => {
  const { lang, id } = req.params;
  const { title,subtitle,link } = req.body;
  const sqlSelect = "SELECT title, subtitle, link FROM contactfooter WHERE lang = ? AND id = ?";
    
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
    // const updatedTitle = title !== undefined ? title : existing.title;
    const updatedsubTitle = subtitle !== undefined ? subtitle : existing.subtitle;

    const updatedlink = link !== undefined ? link : existing.link;
  const sqlUpdate =
  "UPDATE contactfooter SET title = ?, subtitle = ?, link = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [title, updatedsubTitle, updatedlink, lang, id], (err, result) => {
  if (err) {
    console.error("Error updating data:", err);
    return res.status(500).json({ message: err.message });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "No matching record found to update" });
  }

  res.status(200).json({ message: "contactfooter updated successfully" });
});
  })
};
const getcontactfooter = (req, res) => {
  const sqlSelect = "SELECT * FROM contactfooter";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getcontactfooterById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM contactfooter WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};


// Delete contact footer function
const deletecontactfooter = async (req, res) => {
  const { id } = req.params; // Get the ID from request parameters

  const query = "DELETE FROM contactfooter WHERE id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting contact footer:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "No contact footer found with this ID" });
    }

    res.json({
      message: "Contact footer deleted successfully",
    });
  });
};

module.exports = { getcontactfooterByLang, addcontactfooter, updatecontactfooter,getcontactfooter,getcontactfooterById ,deletecontactfooter};
