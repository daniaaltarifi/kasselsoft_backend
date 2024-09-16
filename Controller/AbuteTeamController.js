const db = require("../config.js");
const fs = require("fs");
const path = require("path");



const getAboutTemeByLang = (req, res) => {
    const { lang } = req.params;
    const sqlSelect = "SELECT * FROM aboutteme WHERE lang = ?";
    db.query(sqlSelect, [lang], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(result);
    });
};

const updateAboutTeme = (req, res) => {
  const { lang, id } = req.params;
  const { name, major, projects } = req.body;

  // Log request parameters
  console.log(`PUT request received for ID: ${id}, Lang: ${lang}`);
  console.log("Body:", req.body);

  // Select existing data
  const sqlSelect = "SELECT name, major, projects FROM aboutteme WHERE lang = ? AND id = ?";

  db.query(sqlSelect, [lang, id], (err, results) => {
      if (err) {
          console.error("Error fetching current data:", err);
          return res.status(500).json({ message: err.message });
      }

      console.log("Select results:", results);

      if (results.length === 0) {
          return res.status(404).json({ message: "No matching record found to update" });
      }

      // Get existing values
      const existing = results[0];

      // Update fields only if new values are provided, otherwise retain existing values
      const updatedName = name !== undefined ? name : existing.name;
      const updatedMajor = major !== undefined ? major : existing.major;
      const updatedProjects = projects !== undefined ? projects : existing.projects;

      // Log existing and updated values
      console.log("Existing values:", existing);
      console.log("Updated values:", { name: updatedName, major: updatedMajor, projects: updatedProjects });

      // Check if there is anything to update (if fields are actually changed)
      if (updatedName === existing.name && updatedMajor === existing.major && updatedProjects === existing.projects) {
          return res.status(400).json({ message: "No changes detected, nothing to update." });
      }

      // Update query
      const sqlUpdate = "UPDATE aboutteme SET name = ?, major = ?, projects = ? WHERE lang = ? AND id = ?";

      db.query(
          sqlUpdate,
          [updatedName, updatedMajor, updatedProjects, lang, id],
          (err, result) => {
              if (err) {
                  console.error("Error updating data:", err);
                  return res.status(500).json({ message: err.message });
              }

              // Log update result
              console.log("Update result:", result);

              // Check if the update actually affected rows
              if (result.affectedRows === 0) {
                  return res.status(404).json({ message: "No matching record found to update" });
              }

              res.status(200).json({ message: "AboutTeme updated successfully" });
          }
      );
  });
};
      






const createAboutTeme = (req, res) => {
    const { lang } = req.params;
    const {  name, major, projects } = req.body;
    
    const sqlInsert = "INSERT INTO aboutteme (lang, name, major, projects) VALUES (?, ?, ?, ?)";
    
    db.query(sqlInsert, [lang, name, major, projects], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: "Record created successfully" });
    });
};

const getAllAboutTeme = (req, res) => {
    const sqlSelect = "SELECT * FROM aboutteme";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(result);
    });
};

const getAboutTemeById = (req, res) => {
    const { id } = req.params; // Get the id from the route parameters

    const sqlSelect = "SELECT * FROM aboutteme WHERE id = ?";

    db.query(sqlSelect, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(result[0]); // Return the found record
    });
};


// Delete team member by ID
const deleteAboutTeme = (req, res) => {
    const { id } = req.params; // Get the id from the URL parameter

    // SQL query to delete the record by id
    const sqlDelete = "DELETE FROM aboutteme WHERE id = ?";

    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting the record", error: err.message });
        }

        // If no rows were affected, it means the ID was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found" });
        }

        // Successful deletion
        res.status(200).json({ message: "Record deleted successfully" });
    });
};





module.exports = {
    getAboutTemeByLang,
    updateAboutTeme,
    createAboutTeme,
    getAllAboutTeme,
    getAboutTemeById,
    deleteAboutTeme
};
