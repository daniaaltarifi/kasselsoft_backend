const db = require("../config.js");

// Add contact form entry
const addcontactform = async (req, res) => {
  const { name, email, message, phone } = req.body;

  // Check for missing fields
  if (!name || !email || !message || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert data into the database
  const query = "INSERT INTO contactform (name, email, message, phone) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, message, phone], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "Contact form added successfully",
      insertId: results.insertId,
    });
  });
};

// Get all contact forms
const getcontactform = (req, res) => {
  const query = "SELECT * FROM contactform";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};

// Get a specific contact form by ID
const getcontactformById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM contactform WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Contact form not found" });
    }

    res.json(results[0]);
  });
};



// Delete a contact form entry
const deletecontactForm = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM contactform WHERE id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Contact form not found" });
    }

    res.json({ message: "Contact form deleted successfully" });
  });
};

module.exports = {
  addcontactform,
 
  getcontactform,
  getcontactformById,
  deletecontactForm,
};
