const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addblogs function
const addblogs = async (req, res) => {
  const { lang } = req.params;
  const { title, main_description, tag_id, descriptions } = req.body;

  const main_img = req.files['main_img'] ? req.files['main_img'][0].filename : null;

  if (!lang || !title || !main_description || !main_img || !tag_id || !Array.isArray(descriptions)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const blogQuery = "INSERT INTO blogs (lang, title, main_description, main_img, tag_id) VALUES (?, ?, ?, ?, ?)";
  db.query(blogQuery, [lang, title, main_description, main_img, tag_id], (error, results) => {
    if (error) {
      console.error("Error inserting blog data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    const blogId = results.insertId;
    const descriptionPromises = [];

    // Loop through each description dynamically
    descriptions.forEach((description, index) => {
      const descriptionText = description.text;

      if (descriptionText) {
        descriptionPromises.push(new Promise((resolve, reject) => {
          const descriptionQuery = "INSERT INTO blog_descriptions (blog_id, description) VALUES (?, ?)";
          db.query(descriptionQuery, [blogId, descriptionText], (error, descResults) => {
            if (error) {
              console.error(`Error inserting description for blog ${blogId}:`, error);
              return reject(error);
            }

            const descriptionId = descResults.insertId;

            // Access images specifically for this description
            const images = req.files[`descriptions[${index}][img]`] || []; // Collect images for the current description

            const imagePromises = images.map(image => {
              return new Promise((resolve, reject) => {
                const imageQuery = "INSERT INTO blog_images (blog_description_id, img) VALUES (?, ?)";
                db.query(imageQuery, [descriptionId, image.filename], (error) => {
                  if (error) {
                    console.error(`Error inserting image for description ${descriptionId}:`, error);
                    return reject(error);
                  }
                  resolve();
                });
              });
            });

            Promise.all(imagePromises).then(resolve).catch(reject);
          });
        }));
      }
    });

    Promise.all(descriptionPromises)
      .then(() => {
        res.json({
          message: "Blog added successfully with multiple descriptions and images",
          insertId: blogId,
        });
      })
      .catch(error => {
        console.error("Error inserting description or image data:", error);
        return res.status(500).json({ error: "Database error", details: error.message });
      });
  });
};


const getblogsByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = `
  SELECT blogs.*, tags.tag_name AS tag_name
   FROM blogs
   JOIN tags ON blogs.tag_id = tags.id
   WHERE blogs.lang =?
`;
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
  
  
  const updateblogs = async (req, res) => {
    const { lang, id } = req.params; // Assuming you're using :lang and :id in your route
    const { title, main_description, tag_id, descriptions } = req.body;
  
    // Handle the main image
    const main_img = req.files['main_img'] ? req.files['main_img'][0].filename : null;
  
    // Check for required fields
    if (!lang || !id || !title || !main_description || (!main_img && !req.body.keep_main_img) || !tag_id || !Array.isArray(descriptions)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    // Update the main blog entry
    const blogQuery = "UPDATE blogs SET lang = ?, title = ?, main_description = ?, main_img = ?, tag_id = ? WHERE id = ?";
    db.query(blogQuery, [lang, title, main_description, main_img || req.body.keep_main_img, tag_id, id], (error) => {
      if (error) {
        console.error("Error updating blog data:", error);
        return res.status(500).json({ error: "Database error" });
      }
  
      // Handle descriptions
      const descriptionPromises = [];
  
      // Loop through each description dynamically
      descriptions.forEach((description, index) => {
        const descriptionText = description.text;
        const descriptionId = description.id; // Assuming each description has an id for updates
  
        if (descriptionText) {
          // Update existing description
          if (descriptionId) {
            descriptionPromises.push(new Promise((resolve, reject) => {
              const descriptionQuery = "UPDATE blog_descriptions SET description = ? WHERE id = ?";
              db.query(descriptionQuery, [descriptionText, descriptionId], (error) => {
                if (error) {
                  console.error(`Error updating description ${descriptionId}:`, error);
                  return reject(error);
                }
  
                // Handle images for this description
                const images = req.files[`descriptions[${index}][img]`] || []; // Collect images for the current description
                const imagePromises = images.map(image => {
                  return new Promise((resolve, reject) => {
                    const imageQuery = "INSERT INTO blog_images (blog_description_id, img) VALUES (?, ?)";
                    db.query(imageQuery, [descriptionId, image.filename], (error) => {
                      if (error) {
                        console.error(`Error inserting image for description ${descriptionId}:`, error);
                        return reject(error);
                      }
                      resolve();
                    });
                  });
                });
  
                Promise.all(imagePromises).then(resolve).catch(reject);
              });
            }));
          } else {
            // Insert new description if no ID is provided
            descriptionPromises.push(new Promise((resolve, reject) => {
              const descriptionQuery = "INSERT INTO blog_descriptions (blog_id, description) VALUES (?, ?)";
              db.query(descriptionQuery, [id, descriptionText], (error, descResults) => {
                if (error) {
                  console.error(`Error inserting new description for blog ${id}:`, error);
                  return reject(error);
                }
  
                const descriptionId = descResults.insertId;
                const images = req.files[`descriptions[${index}][img]`] || []; // Collect images for the new description
  
                const imagePromises = images.map(image => {
                  return new Promise((resolve, reject) => {
                    const imageQuery = "INSERT INTO blog_images (blog_description_id, img) VALUES (?, ?)";
                    db.query(imageQuery, [descriptionId, image.filename], (error) => {
                      if (error) {
                        console.error(`Error inserting image for new description ${descriptionId}:`, error);
                        return reject(error);
                      }
                      resolve();
                    });
                  });
                });
  
                Promise.all(imagePromises).then(resolve).catch(reject);
              });
            }));
          }
        }
      });
  
      // Wait for all descriptions to be processed
      Promise.all(descriptionPromises)
        .then(() => {
          res.json({
            message: "Blog updated successfully with descriptions and images",
            updatedId: id,
          });
        })
        .catch(error => {
          console.error("Error updating description or image data:", error);
          return res.status(500).json({ error: "Database error", details: error.message });
        });
    });
  };
  
// const updateblogs = (req, res) => {
//     const { lang, id } = req.params;
//     const { title, main_description, tag_id } = req.body;
//     const img = req.files && req.files["img"] ? req.files["img"][0].filename : null;
  
//     // First, retrieve the current values
//     const sqlSelect = "SELECT * FROM blogs WHERE lang = ? AND id = ?";
  
//     db.query(sqlSelect, [lang, id], (err, results) => {
//       if (err) {
//         console.error("Error fetching current data:", err);
//         return res.status(500).json({ message: "Error fetching current data: " + err.message });
//       }
  
//       if (results.length === 0) {
//         return res.status(404).json({ message: "No matching record found to update" });
//       }
  
//       // Get existing values
//       const existing = results[0];
  
//       // Update fields only if new values are provided
//       const updatedTitle = title !== undefined ? title : existing.title;
//       const updatedmain_description = main_description !== undefined ? main_description : existing.main_description;
//       const updatedTagId = tag_id !== undefined ? tag_id : existing.tag_id;
//       const updatedImg = img !== null ? img : existing.img;
  
//       // Construct the update SQL query
//       const sqlUpdate = "UPDATE blogs SET title = ?, main_description = ?, tag_id = ?, img = ? WHERE lang = ? AND id = ?";
  
//       db.query(sqlUpdate, [updatedTitle, updatedmain_description, updatedTagId, updatedImg, lang, id], (err, result) => {
//         if (err) {
//           console.error("Error updating data:", err);
//           return res.status(500).json({ message: "Error updating data: " + err.message });
//         }
  
//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: "No matching record found to update" });
//         }
  
//         res.status(200).json({ message: "Blog updated successfully" });
//       });
//     });
//   };
  
  

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
  // const getblogsByIdAndLang = (req, res) => {
  //   const { lang, id } = req.params;
  //       const sqlSelect = `
  //     SELECT blogs.*, blog_descriptions.description AS description
  //     FROM blogs
  //     LEFT JOIN blog_descriptions ON blog_descriptions.blog_id = blogs.id
  //     WHERE blogs.lang = ? AND blogs.id = ?;
  //   `;
  
  //   db.query(sqlSelect, [lang, id], (err, result) => {
  //     if (err) {
  //       return res.status(500).json({ message: err.message });
  //     }
  
  //     if (result.length === 0) {
  //       return res.status(404).json({ message: "Blog not found" });
  //     }
  
  //     res.status(200).json(result);
  //   });
  // };
const getblogsByIdAndLang = (req, res) => {
  const { lang, id } = req.params;
  const sqlSelect = `
    SELECT blogs.*, 
           blog_descriptions.id AS description_id, 
           blog_descriptions.description AS description,
           blog_images.img AS img
    FROM blogs
    LEFT JOIN blog_descriptions ON blog_descriptions.blog_id = blogs.id
    LEFT JOIN blog_images ON blog_images.blog_description_id = blog_descriptions.id
    WHERE blogs.lang = ? AND blogs.id = ?;
  `;

  db.query(sqlSelect, [lang, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Organize the results
    const blog = {
      id: result[0].id,
      lang: result[0].lang,
      title: result[0].title,
      main_description: result[0].main_description,
      main_img: result[0].main_img,
      tag_id: result[0].tag_id,
      descriptions: []
    };

    // Group descriptions and their images
    result.forEach(row => {
      const description = {
        id: row.description_id,
        description: row.description,
        images: row.img ? [row.img] : [] // Initialize with the image if it exists
      };

      // Check if this description is already added to the blog
      const existingDescription = blog.descriptions.find(desc => desc.id === description.id);
      if (existingDescription) {
        // If it exists, add the image to the existing images array
        if (row.img) {
          existingDescription.images.push(row.img);
        }
      } else {
        // If it does not exist, push the new description
        blog.descriptions.push(description);
      }
    });

    res.status(200).json(blog);
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
