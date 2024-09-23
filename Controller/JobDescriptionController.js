const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addjobdescrform function
const addjobdescrform = async (req, res) => {
    const {careers_id}=req.params
  const { first_name, last_name, email, exp,skills, phone } =
    req.body;
    const skillsString = Array.isArray(skills) ? skills.join(",") : skills;

  const cv = req.files && req.files["cv"] ? req.files["cv"][0].filename : null;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !careers_id ||
    !exp ||
    !phone ||
    !cv
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query =
    "INSERT INTO jobdescrform (first_name, last_name, email, careers_id, exp, skills, phone, cv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [first_name, last_name, email, careers_id, exp, skillsString, phone, cv],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "jobdescrform added successfully",
        insertId: results.insertId,
      });
    }
  );
};

// const updatejobdescrform = (req, res) => {
//   const { id } = req.params;
//   const { first_name, last_name, email, careers_id, exp, skills, phone } =
//     req.body;
//   const cv = req.files && req.files["cv"] ? req.files["cv"][0].filename : null;

//   // First, retrieve the current values
//   const sqlSelect = "SELECT * FROM jobdescrform WHERE id = ?";

//   db.query(sqlSelect, [id], (err, results) => {
//     if (err) {
//       console.error("Error fetching current data:", err);
//       return res.status(500).json({ message: err.message });
//     }

//     if (results.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No matching record found to update" });
//     }

//     // Get existing values
//     const existing = results[0];

//     // Update fields only if new values are provided
//     const updatedfirst_name =
//       first_name !== undefined ? first_name : existing.first_name;
//     const updatedlast_name =
//       last_name !== undefined ? last_name : existing.last_name;
//     const updatedemail = email !== undefined ? email : existing.email;
//     const updatedcareers_id =
//       careers_id !== undefined ? careers_id : existing.careers_id;
//     const updatedexp = exp !== undefined ? exp : existing.exp;
//     const updatedskills = skills !== undefined ? skills : existing.skills;
//     const updatedphone = phone !== undefined ? phone : existing.phone;
//     const updatedcv = cv !== null ? cv : existing.cv;

//     // Construct the update SQL query
//     const sqlUpdate =
//       "UPDATE jobdescrform SET first_name = ?, last_name = ?, email = ?, careers_id = ?, exp = ?, skills = ?, phone = ?, cv = ? WHERE id = ?";

//     db.query(
//       sqlUpdate,
//       [
//         updatedfirst_name,
//         updatedlast_name,
//         updatedemail,
//         updatedcareers_id,
//         updatedexp,
//         updatedskills,
//         updatedphone,
//         updatedcv,
//         id,
//       ],
//       (err, result) => {
//         if (err) {
//           console.error("Error updating data:", err);
//           return res.status(500).json({ message: err.message });
//         }

//         if (result.affectedRows === 0) {
//           return res
//             .status(404)
//             .json({ message: "No matching record found to update" });
//         }

//         res.status(200).json({ message: "jobdescrform updated successfully" });
//       }
//     );
//   });
// };

const getjobdescrform = (req, res) => {
  const sqlSelect = `
    SELECT jobdescrform.*, careers.position_name AS position_name
     FROM jobdescrform
     JOIN careers ON jobdescrform.careers_id = careers.id
 `;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getjobdescrformById = (req, res) => {
  const { id } = req.params;
  const sqlSelect =
    "SELECT jobdescrform.*, careers.position_name AS position_name FROM jobdescrform JOIN careers ON jobdescrform.careers_id = careers.id WHERE jobdescrform.id = ?";

  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const deletejobdescrform = (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM jobdescrform WHERE id = ?";
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ message: "jobdescrform Deleted successfully" });
  });
};
module.exports = {
  addjobdescrform,
  getjobdescrform,
  getjobdescrformById,
  deletejobdescrform,
};
