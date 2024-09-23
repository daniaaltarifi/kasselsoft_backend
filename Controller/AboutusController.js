const db = require("../config.js");
const fs = require("fs");
const path = require("path");



// Get About Page by Language
const getAboutByLang = (req, res) => {
    const { lang } = req.params;
    const sqlSelect = "SELECT * FROM about WHERE lang = ?";
    db.query(sqlSelect, [lang], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };


  
  // Get All About Pages
  const getAbout = (req, res) => {
    const sqlSelect = "SELECT * FROM about";
    db.query(sqlSelect, (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
  
 const getaboutById = (req, res) => {
    const { id } = req.params;
    const sqlSelect = "SELECT * FROM about WHERE id =?";
    db.query(sqlSelect, [id], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  
 }
// Update About Page
const updateAbout = (req, res) => {
    const { lang,id } = req.params;
    const {  point1, point2, point3 } = req.body;
    

    const image1 =
    req.files && req.files["image1"]? req.files["image1"][0].filename: null;

  const image2 =
    req.files && req.files["image2"]? req.files["image2"][0].filename: null;
    // Select existing data for validation
    const sqlSelect = "SELECT point1, point2, point3, image1, image2  FROM about WHERE lang = ? AND id = ?";
    db.query(sqlSelect, [lang, id], (err, results) => {
        if (err) {
            console.error("Error fetching current data:", err);
            return res.status(500).json({ message: err.message });
        }
    
        if (results.length === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
        }

        // Update the fields only if they are provided, otherwise retain existing values
        const existing = results[0];
        const updatedImage1 = image1 !== null ? image1 : existing.image1;
        const updatedImage2 = image2 !== null ? image2 : existing.image2;
        const updatedPoint1 = point1 !== undefined ? point1 : existing.point1;
        const updatedPoint2 = point2 !== undefined ? point2 : existing.point2;
        const updatedPoint3 = point3 !== undefined ? point3 : existing.point3;

        // Update query
        const sqlUpdate = `
            UPDATE about 
            SET  point1 = ?, point2 = ?, point3 = ?, image1 = ?, image2 = ?
            WHERE lang = ? AND id = ?
        `;

        db.query(
            sqlUpdate,
            [ updatedPoint1, updatedPoint2, updatedPoint3,updatedImage1, updatedImage2, lang, id],
            (err, result) => {
                if (err) {
                    console.error("Error updating data:", err);
                    return res.status(500).json({ message: err.message });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "No matching record found to update" });
                }

                res.status(200).json({ message: "About page updated successfully" });
            }
        );
    });
};


const addAbout = (req, res) => {
    const { lang } = req.params;
    const { point1, point2, point3 } = req.body;

    // Extract image files if provided
    const image1 = req.files && req.files["image1"] ? req.files["image1"][0].filename : null;
    const image2 = req.files && req.files["image2"] ? req.files["image2"][0].filename : null;

    // Check if required fields are provided
    if (!point1 || !point2 || !point3 || !lang) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Insert query to add a new 'About' entry
    const sqlInsert = `
        INSERT INTO about (lang, point1, point2, point3, image1, image2) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sqlInsert,
        [lang, point1, point2, point3, image1, image2],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).json({ message: err.message });
            }

            // Check if the insertion was successful
            if (result.affectedRows === 0) {
                return res.status(500).json({ message: "Failed to add about page" });
            }

            res.status(201).json({ message: "About page added successfully" });
        }
    );
};

module.exports = { getAboutByLang, getAbout, updateAbout,addAbout,getaboutById };