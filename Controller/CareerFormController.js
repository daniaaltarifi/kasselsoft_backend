const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addcareerform function
const addcareerform = async (req, res) => {
  const { first_name, last_name, email, position_id, cover_letter, phone } =
    req.body;
  const cv = req.files && req.files["cv"] ? req.files["cv"][0].filename : null;
  if (
    !first_name ||
    !last_name ||
    !email ||
    !position_id ||
    !cover_letter ||
    !phone ||
    !cv
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query =
    "INSERT INTO careerform (first_name, last_name, email, position_id, cover_letter, phone, cv) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [first_name, last_name, email, position_id, cover_letter, phone, cv],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "careerform added successfully",
        insertId: results.insertId,
      });
    }
  );
};

// const getcareerformByLang = (req, res) => {
//   const { lang } = req.params;
//   const sqlSelect = "SELECT * FROM careerform WHERE lang = ?";
//   db.query(sqlSelect, [lang], (err, result) => {
//     if (err) {
//       return res.json({ message: err.message });
//     }
//     res.status(200).json(result);
//   });
// };
const updatecareerform = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, position_id, cover_letter, phone } =
    req.body;
  const cv = req.files && req.files["cv"] ? req.files["cv"][0].filename : null;

  // First, retrieve the current values
  const sqlSelect = "SELECT * FROM careerform WHERE id = ?";

  db.query(sqlSelect, [id], (err, results) => {
    if (err) {
      console.error("Error fetching current data:", err);
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching record found to update" });
    }

    // Get existing values
    const existing = results[0];

    // Update fields only if new values are provided
    const updatedfirst_name =
      first_name !== undefined ? first_name : existing.first_name;
    const updatedlast_name =
      last_name !== undefined ? last_name : existing.last_name;
    const updatedemail = email !== undefined ? email : existing.email;
    const updatedposition_id =
      position_id !== undefined ? position_id : existing.position_id;
    const updatedcover_letter =
      cover_letter !== undefined ? cover_letter : existing.cover_letter;
    const updatedphone = phone !== undefined ? phone : existing.phone;
    const updatedcv = cv !== null ? cv : existing.cv;

    // Construct the update SQL query
    const sqlUpdate =
      "UPDATE careerform SET first_name = ?, last_name = ?, email = ?, position_id = ?, cover_letter = ?, phone = ?, cv = ? WHERE id = ?";

    db.query(
      sqlUpdate,
      [
        updatedfirst_name,
        updatedlast_name,
        updatedemail,
        updatedposition_id,
        updatedcover_letter,
        updatedphone,
        updatedcv,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).json({ message: err.message });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "No matching record found to update" });
        }

        res.status(200).json({ message: "careerform updated successfully" });
      }
    );
  });
};

const getcareerform = (req, res) => {
  const sqlSelect = `
    SELECT careerform.*, positionrole.position_name AS position_name
     FROM careerform
     JOIN positionrole ON careerform.position_id = positionrole.id
 `;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getcareerformById = (req, res) => {
    const { id } = req.params;
    const sqlSelect =
      "SELECT careerform.*, positionrole.position_name AS position_name FROM careerform JOIN positionrole ON careerform.position_id = positionrole.id WHERE careerform.id = ?";
    
    db.query(sqlSelect, [id], (err, result) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
  const deletecareerForm = (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM careerform WHERE id = ?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({message: "careerform Deleted successfully"});
 
    })
}
module.exports = {
  addcareerform,
  updatecareerform,
  getcareerform,
  getcareerformById,
  deletecareerForm
};
