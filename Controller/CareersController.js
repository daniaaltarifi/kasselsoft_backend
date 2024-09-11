const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addcareers function
const addcareers = async (req, res) => {
  const { lang } = req.params;
  const { position_name,location,exp,description,responsabilites,requirment,benefit, open_count } = req.body;
 

  if ( !lang || !position_name || !location || !exp || !description || !responsabilites || !requirment || !benefit || !open_count) {
    return res.status(400).json({ error: "Missing value " });
  }

  const query =
    "INSERT INTO careers (lang, position_name, location, exp, description, responsabilites, requirment, benefit, open_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(query, [lang, position_name,location,exp,description, responsabilites, requirment, benefit, open_count], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "careers added successfully",
      insertId: results.insertId,
    });
  });
};

const getcareersByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM careers WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatecareers = (req, res) => {
  const { lang, id } = req.params;
  const { position_name,location,exp,description, open_count,responsabilites,requirment,benefit } = req.body;
  const sqlSelect = "SELECT * FROM careers WHERE lang = ? AND id = ?";
    
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
    const updatedposition_name = position_name !== undefined ? position_name : existing.position_name;
    const updatedlocation = location !== undefined ? location : existing.location;
    const updatedexp = exp !== undefined ? exp : existing.exp;
    const updateddescription = description !== undefined ? description : existing.description;
    const updatedresponsabilites = responsabilites !== undefined ? responsabilites : existing.responsabilites;
    const updatedrequirment = requirment !== undefined ? requirment : existing.require;
    const updatedbenefit = benefit !== undefined ? benefit : existing.benefit;

    const updatedopen_count = open_count !== undefined ? open_count : existing.open_count;

  const sqlUpdate =
  "UPDATE careers SET position_name = ?, location = ?, exp = ?, description = ?, responsabilites = ?, requirment = ?, benefit = ?, open_count = ? WHERE lang = ? AND id = ?";

db.query(sqlUpdate, [updatedposition_name, updatedlocation, updatedexp, updateddescription, updatedresponsabilites, updatedrequirment, updatedbenefit,updatedopen_count, lang, id], (err, result) => {
  if (err) {
    console.error("Error updating data:", err);
    return res.status(500).json({ message: err.message });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "No matching record found to update" });
  }

  res.status(200).json({ message: "careers updated successfully" });
});
  })
};
const getcareers = (req, res) => {
  const sqlSelect = "SELECT * FROM careers";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getcareersById = (req, res) => {
  const {lang, id } = req.params;
  const sqlSelect = "SELECT * FROM careers WHERE lang = ? AND id = ?";
  db.query(sqlSelect, [lang,id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const deletecareers = (req, res) => {
    const { lang, id } = req.params;
    const sqlDelete = "DELETE FROM careers WHERE lang = ? AND id = ?";
    db.query(sqlDelete, [lang, id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({message: "careers Deleted successfully"});
 
    })
}
module.exports = { getcareersByLang, addcareers, updatecareers,getcareers,getcareersById,deletecareers };
