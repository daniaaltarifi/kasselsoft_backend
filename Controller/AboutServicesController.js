const db = require("../config.js");
const fs = require("fs");
const path = require("path");



const createaboutServices = (req, res) => {
    const { lang } = req.params;
    const {  icon, title} = req.body;
    
    const sqlInsert = "INSERT INTO aboutservices (lang, icon, title) VALUES (?,?,?)";
    
    db.query(sqlInsert, [lang,  icon, title], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(201).json({ message: "Record created successfully" });
    });
};

// Assuming you have a file like `aboutServicesController.js`

const getAboutServiceById = (req, res) => {
    const { id } = req.params; // Retrieve the ID from request parameters

    const sqlQuery = "SELECT * FROM aboutservices WHERE id = ?";

    db.query(sqlQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json(result[0]); // Return the record
    });
};


const getaboutServicesByLang = (req, res) => {
    const { lang } = req.params;
    const sqlSelect = "SELECT * FROM aboutservices WHERE lang = ?";
    db.query(sqlSelect, [lang], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(result);
    });
};



const getAllaboutServices = (req, res) => {
    const sqlSelect = "SELECT * FROM aboutservices";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json(result);
    });
};



const updateaboutServices = (req, res) => {
    const { lang, id } = req.params;
    const { title, icon } = req.body;

    // Log request parameters
    console.log(`PUT request received for ID: ${id}, Lang: ${lang}`);
    console.log("Body:", req.body);

    // Select existing data
    const sqlSelect = "SELECT title, icon FROM aboutservices WHERE lang = ? AND id = ?";

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
        const updatedTitle = title !== undefined ? title : existing.title;
        const updatedIcon = icon !== undefined ? icon : existing.icon;

        // Log existing and updated values
        console.log("Existing values:", existing);
        console.log("Updated values:", { title: updatedTitle, icon: updatedIcon });

        // Check if there is anything to update (if fields are actually changed)
        if (updatedTitle === existing.title && updatedIcon === existing.icon) {
            return res.status(400).json({ message: "No changes detected, nothing to update." });
        }

        // Update query
        const sqlUpdate = "UPDATE aboutservices SET title = ?, icon = ? WHERE lang = ? AND id = ?";

        db.query(
            sqlUpdate,
            [updatedTitle, updatedIcon, lang, id],
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

                res.status(200).json({ message: "AboutServices updated successfully" });
            }
        );
    });
};
// Assuming you have a file like `aboutServicesController.js`

const deleteAboutServiceById = (req, res) => {
    const { id } = req.params; // Retrieve the ID from request parameters

    const sqlDelete = "DELETE FROM aboutservices WHERE id = ?";

    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ message: "Record deleted successfully" });
    });
};


module.exports = {
    createaboutServices,
    getaboutServicesByLang,
    getAllaboutServices,
    updateaboutServices,
    getAboutServiceById,
    deleteAboutServiceById
};
