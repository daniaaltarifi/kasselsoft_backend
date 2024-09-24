const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addposition function
const addposition = async (req, res) => {
    const { position_name } = req.body;
  
    // Validate input
    if (!position_name) {
      return res.status(400).json({ error: "Missing value" });
    }
  
    // SQL query with correct syntax
    const query = "INSERT INTO positionrole (position_name) VALUES (?)";
  
    // Use parameterized query to prevent SQL injection
    db.query(query, [position_name], (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Database error" });
      }
  
      res.json({
        message: "Position added successfully",
        insertId: results.insertId,
      });
    });
  };
  

// const updateposition = (req, res) => {
//     const { id } = req.params;
//     const { position_name } = req.body;
  
//     // Query to select the current data
//     const sqlSelect = "SELECT position_name FROM positionrole WHERE id = ?";
      
//     db.query(sqlSelect, [id], (err, results) => {
//       if (err) {
//         console.error("Error fetching current data:", err);
//         return res.status(500).json({ message: err.message });
//       }
  
//       if (results.length === 0) {
//         return res.status(404).json({ message: "No matching record found to update" });
//       }
  
//       // Get existing value
//       const existing = results[0].position_name;
  
//       // Update field only if new value is provided
//       const updatedPosition = position_name !== undefined ? position_name : existing;
      
//       if (updatedPosition === existing) {
//         return res.status(400).json({ message: "No change in position name" });
//       }
  
//       // Correct SQL query syntax for update
//       const sqlUpdate = "UPDATE positionrole SET position_name = ? WHERE id = ?";
  
//       db.query(sqlUpdate, [updatedPosition, id], (err, result) => {
//         if (err) {
//           console.error("Error updating data:", err);
//           return res.status(500).json({ message: err.message });
//         }
  
//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: "No matching record found to update" });
//         }
  
//         res.status(200).json({ message: "Position updated successfully" });
//       });
//     });
//   };
  
const getposition = (req, res) => {
  const sqlSelect = "SELECT * FROM positionrole";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getpositionById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM positionrole WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const deleteposition = (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM positionrole WHERE id =?";
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json({ message: "Position deleted successfully" });
  });
}
module.exports = { addposition,getposition,getpositionById,deleteposition };
