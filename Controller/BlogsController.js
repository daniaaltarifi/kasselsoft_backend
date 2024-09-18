const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addblogs function
const addblogs = async (req, res) => {
  const { lang } = req.params;
  const { title, main_description, tag_id, description } = req.body; // Note that 'description' will be a string
  const main_img = req.files && req.files["main_img"] ? req.files["main_img"][0].filename : null;

  // Collect img
  const img = req.files && req.files["img"] ? req.files["img"] : [];
  
  if (!lang || !title || !main_description || !main_img || !tag_id || !description || img.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert blog entry
  const blogQuery = "INSERT INTO blogs (lang, title, main_description, main_img, tag_id) VALUES (?, ?, ?, ?, ?)";
  db.query(blogQuery, [lang, title, main_description, main_img,tag_id], (error, results) => {
    if (error) {
      console.error("Error inserting blog data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    const blogId = results.insertId;

    // Insert description
    const descriptionQuery = "INSERT INTO blog_descriptions (blog_id, description) VALUES (?, ?)";
    db.query(descriptionQuery, [blogId, description], (error, descResults) => {
      if (error) {
        console.error("Error inserting description:", error);
        return res.status(500).json({ error: "Database error" });
      }

      const descriptionId = descResults.insertId;

      // Insert img for this description
      const imagePromises = img.map(image => {
        return new Promise((resolve, reject) => {
          const imgPath = image.filename; // Use the path to the uploaded file
          const imageQuery = "INSERT INTO blog_images (blog_description_id, img) VALUES (?, ?)";
          db.query(imageQuery, [descriptionId, imgPath], (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      });

      // Wait for all img to be inserted
      Promise.all(imagePromises)
        .then(() => {
          res.json({
            message: "Blog added successfully with description and img",
            insertId: blogId,
          });
        })
        .catch(error => {
          console.error("Error inserting image data:", error);
          return res.status(500).json({ error: "Database error" });
        });
    });
  });
};






// const addblogs = async (req, res) => {
//   const { lang } = req.params;
//   const { title,main_description,tag_id } = req.body;
//   const img =
//     req.files && req.files["img"] ? req.files["img"][0].filename : null;
//   if (!lang || !title || !main_description || !tag_id || !img) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const query =
//     "INSERT INTO blogs (lang, title, main_description, tag_id, img) VALUES (?, ?, ?, ?, ?)";

//   db.query(query, [lang, title, main_description, tag_id, img], (error, results) => {
//     if (error) {
//       console.error("Error inserting data:", error);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.json({
//       message: "blogs added successfully",
//       insertId: results.insertId,
//     });
//   });
// };

const getblogsByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM blogs WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    const formattedResults = result.map(blog => {
        // Parse the string date into a Date object
        const updatedDate = new Date(blog.updated_at);
  
        return {
          ...blog,
          updated_at: updatedDate.toISOString().split('T')[0] // Format the date
        };
      });
    res.status(200).json(formattedResults);
  });
};
const getRecentBlog = (req, res) => {
    const { lang } = req.params;
  
    // Query to select the 3 most recent blog entries
    const sqlSelect = "SELECT * FROM blogs WHERE lang = ? ORDER BY id DESC LIMIT 3";
  
    db.query(sqlSelect, [lang], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
  
      // If no results found
      if (result.length === 0) {
        return res.status(404).json({ message: "No blog entries found" });
      }
  
      // Format each result to include only the date part
      const formattedResults = result.map(blog => {
        // Parse the string date into a Date object
        const updatedDate = new Date(blog.updated_at);
  
        return {
          ...blog,
          updated_at: updatedDate.toISOString().split('T')[0] // Format the date
        };
      });
  
      // Return the formatted results
      res.status(200).json(formattedResults);
    });
  };
  
  
  
const updateblogs = (req, res) => {
    const { lang, id } = req.params;
    const { title, main_description, tag_id } = req.body;
    const img = req.files && req.files["img"] ? req.files["img"][0].filename : null;
  
    // First, retrieve the current values
    const sqlSelect = "SELECT * FROM blogs WHERE lang = ? AND id = ?";
  
    db.query(sqlSelect, [lang, id], (err, results) => {
      if (err) {
        console.error("Error fetching current data:", err);
        return res.status(500).json({ message: "Error fetching current data: " + err.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No matching record found to update" });
      }
  
      // Get existing values
      const existing = results[0];
  
      // Update fields only if new values are provided
      const updatedTitle = title !== undefined ? title : existing.title;
      const updatedmain_description = main_description !== undefined ? main_description : existing.main_description;
      const updatedTagId = tag_id !== undefined ? tag_id : existing.tag_id;
      const updatedImg = img !== null ? img : existing.img;
  
      // Construct the update SQL query
      const sqlUpdate = "UPDATE blogs SET title = ?, main_description = ?, tag_id = ?, img = ? WHERE lang = ? AND id = ?";
  
      db.query(sqlUpdate, [updatedTitle, updatedmain_description, updatedTagId, updatedImg, lang, id], (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).json({ message: "Error updating data: " + err.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "No matching record found to update" });
        }
  
        res.status(200).json({ message: "Blog updated successfully" });
      });
    });
  };
  
  

const getblogs = (req, res) => {
  const sqlSelect = "SELECT * FROM blogs";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getblogsById = (req, res) => {
    const { id } = req.params;
    const sqlSelect = "SELECT * FROM blogs WHERE id = ?";
    db.query(sqlSelect, [id], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
  const getblogsByIdAndLang = (req, res) => {
    const { lang ,id } = req.params;
    const sqlSelect = "SELECT * FROM blogs WHERE lang = ? AND id = ?";
    db.query(sqlSelect, [lang,id], (err, result) => {
      if (err) {
        return res.json({ message: err.message });
      }
      res.status(200).json(result);
    });
  };
  const deleteblogs = (req, res) => {
    const { lang, id } = req.params;
    const sqlDelete = "DELETE FROM blogs WHERE lang =? AND id =?";
    db.query(sqlDelete, [lang, id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json("Deleted successfully");
    })
  }
module.exports = { getblogsByLang, addblogs, updateblogs,getblogs,getblogsById,deleteblogs,getRecentBlog,getblogsByIdAndLang };
