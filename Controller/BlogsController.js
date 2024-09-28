const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addblogs function
const addblogs = async (req, res) => {
  const { lang } = req.params;
  const { title, main_description, tag_id, descriptions } = req.body;

  const main_img = req.files["main_img"]
    ? req.files["main_img"][0].filename
    : null;

  if (
    !lang ||
    !title ||
    !main_description ||
    !main_img ||
    !tag_id ||
    !Array.isArray(descriptions)
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const blogQuery =
    "INSERT INTO blogs (lang, title, main_description, main_img, tag_id) VALUES (?, ?, ?, ?, ?)";
  db.query(
    blogQuery,
    [lang, title, main_description, main_img, tag_id],
    (error, results) => {
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
          descriptionPromises.push(
            new Promise((resolve, reject) => {
              const descriptionQuery =
                "INSERT INTO blog_descriptions (blog_id, description) VALUES (?, ?)";
              db.query(
                descriptionQuery,
                [blogId, descriptionText],
                (error, descResults) => {
                  if (error) {
                    console.error(
                      `Error inserting description for blog ${blogId}:`,
                      error
                    );
                    return reject(error);
                  }

                  const descriptionId = descResults.insertId;

                  // Access images specifically for this description
                  const images = req.files[`descriptions[${index}][img]`] || []; // Collect images for the current description

                  const imagePromises = images.map((image) => {
                    return new Promise((resolve, reject) => {
                      const imageQuery =
                        "INSERT INTO blog_images (blog_description_id, img) VALUES (?, ?)";
                      db.query(
                        imageQuery,
                        [descriptionId, image.filename],
                        (error) => {
                          if (error) {
                            console.error(
                              `Error inserting image for description ${descriptionId}:`,
                              error
                            );
                            return reject(error);
                          }
                          resolve();
                        }
                      );
                    });
                  });

                  Promise.all(imagePromises).then(resolve).catch(reject);
                }
              );
            })
          );
        }
      });

      Promise.all(descriptionPromises)
        .then(() => {
          res.json({
            message:
              "Blog added successfully with multiple descriptions and images",
            insertId: blogId,
          });
        })
        .catch((error) => {
          console.error("Error inserting description or image data:", error);
          return res
            .status(500)
            .json({ error: "Database error", details: error.message });
        });
    }
  );
};
const getblogsByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = `
    SELECT blogs.*, 
           tags.tag_name AS tag_name,
           blog_descriptions.id AS description_id, 
           blog_descriptions.description AS description,
           blog_images.img AS img,
           blog_images.id AS image_id  -- Get image ID as well
    FROM blogs
    JOIN tags ON blogs.tag_id = tags.id
    LEFT JOIN blog_descriptions ON blog_descriptions.blog_id = blogs.id
    LEFT JOIN blog_images ON blog_images.blog_description_id = blog_descriptions.id
    WHERE blogs.lang = ?;
  `;

  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }

    const blogsMap = {};

    result.forEach((row) => {
      const blogId = row.id;

      // Initialize the blog object if it doesn't exist
      if (!blogsMap[blogId]) {
        blogsMap[blogId] = {
          id: blogId,
          lang: row.lang,
          title: row.title,
          main_description: row.main_description,
          main_img: row.main_img,
          tag_id: row.tag_id,
          created_at: row.created_at,
          updated_at: new Date(row.updated_at).toISOString().split("T")[0],
          tag_name: row.tag_name,
          descriptions: {},
        };
      }

      // Add descriptions and group images by description ID
      if (row.description_id) {
        if (!blogsMap[blogId].descriptions[row.description_id]) {
          blogsMap[blogId].descriptions[row.description_id] = {
            id: row.description_id,
            description: row.description,
            images: [],
          };
        }

        // Add image to the corresponding description
        if (row.img) {
          blogsMap[blogId].descriptions[row.description_id].images.push({
            id: row.image_id, // Include the image ID
            img: row.img,
          });
        }
      }
    });

    // Convert the descriptions object back to an array
    const formattedResults = Object.values(blogsMap).map(blog => ({
      ...blog,
      descriptions: Object.values(blog.descriptions), // Convert descriptions object to array
    }));

    res.status(200).json(formattedResults);
  });
};

const updateblogs = async (req, res) => {
  const { lang, id } = req.params; // Assuming you're using :lang and :id in your route
  const { title, main_description, tag_id, descriptions } = req.body;

  // Step 1: Fetch current blog data to get existing main_img
  const currentBlogQuery = "SELECT main_img FROM blogs WHERE id = ?";
  db.query(currentBlogQuery, [id], (error, results) => {
    if (error) {
      console.error("Error fetching current blog data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    // Assuming there's only one blog with the provided ID
    const currentMainImg = results[0]?.main_img || null;

    // Step 2: Handle the main image
    const main_img = req.files["main_img"]
      ? req.files["main_img"][0].filename
      : currentMainImg; // Use the current main_img if no new image is uploaded

    // Check for required fields
    if (!lang || !id || !title || !main_description || !tag_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Step 3: Update the main blog entry
    const blogQuery =
      "UPDATE blogs SET lang = ?, title = ?, main_description = ?, main_img = ?, tag_id = ? WHERE id = ?";
    db.query(
      blogQuery,
      [lang, title, main_description, main_img, tag_id, id],
      (error) => {
        if (error) {
          console.error("Error updating blog data:", error);
          return res.status(500).json({ error: "Database error" });
        }

        // Handle descriptions if provided
        if (Array.isArray(descriptions)) {
          const descriptionPromises = [];

          // Loop through each description dynamically
          descriptions.forEach((description, index) => {
            const descriptionText = description.text;
            const descriptionId = description.id; // Assuming each description has an id for updates

            // Insert new description if no ID is provided
            descriptionPromises.push(
              new Promise((resolve, reject) => {
                const descriptionQuery =
                  "INSERT INTO blog_descriptions (blog_id, description) VALUES (?, ?)";
                db.query(
                  descriptionQuery,
                  [id, descriptionText],
                  (error, descResults) => {
                    if (error) {
                      console.error(
                        `Error inserting new description for blog ${id}:`,
                        error
                      );
                      return reject(error);
                    }

                    const descriptionId = descResults.insertId;
                    const images =
                      req.files[`descriptions[${index}][img]`] || []; // Collect images for the new description

                    const imagePromises = images.map((image) => {
                      return new Promise((resolve, reject) => {
                        const imageQuery =
                          "INSERT INTO blog_images (blog_description_id, img) VALUES (?, ?)";
                        db.query(
                          imageQuery,
                          [descriptionId, image.filename],
                          (error) => {
                            if (error) {
                              console.error(
                                `Error inserting image for new description ${descriptionId}:`,
                                error
                              );
                              return reject(error);
                            }
                            resolve();
                          }
                        );
                      });
                    });

                    Promise.all(imagePromises).then(resolve).catch(reject);
                  }
                );
              })
            );
          });

          // Wait for all descriptions to be processed
          Promise.all(descriptionPromises)
            .then(() => {
              res.json({
                message:
                  "Blog updated successfully with descriptions and images",
                updatedId: id,
              });
            })
            .catch((error) => {
              console.error("Error updating description or image data:", error);
              return res
                .status(500)
                .json({ error: "Database error", details: error.message });
            });
        } else {
          // No descriptions provided, respond with success
          res.json({
            message: "Blog updated successfully without descriptions",
            updatedId: id,
          });
        }
      }
    );
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
// FOR FRONTEND
const getblogsByIdAndLangForFront = (req, res) => {
  const { lang, id } = req.params;
  const sqlSelect = `
    SELECT blogs.*,blogs.main_description,blogs.main_img,
           tags.tag_name AS tag_name,
           blog_descriptions.id AS description_id, 
           blog_descriptions.description AS description,
           blog_images.img AS img
    FROM blogs
    JOIN tags ON blogs.tag_id = tags.id
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

    // Transform result into structured format
    const blog = {
      id: result[0].id,
      title: result[0].title,
      main_img: result[0].main_img,
      main_description: result[0].main_description, // Add main_description here
      tag_name: result[0].tag_name,
      descriptions: [],
    };

    result.forEach((row) => {
      // Check if the description already exists in the blog object
      const descriptionIndex = blog.descriptions.findIndex(
        (desc) => desc.id === row.description_id
      );
      if (descriptionIndex === -1) {
        // If not, create a new description entry
        blog.descriptions.push({
          id: row.description_id,
          description: row.description,
          images: [],
        });
      }

      // Add the image to the corresponding description
      if (row.img) {
        blog.descriptions[
          descriptionIndex === -1
            ? blog.descriptions.length - 1
            : descriptionIndex
        ].images.push(row.img);
      }
    });

    res.status(200).json([blog]);
  });
};

// FOR  DASHBOARD
const getblogsByIdAndLang = (req, res) => {
  const { lang, id } = req.params;
  const sqlSelect = `
    SELECT * FROM blogs WHERE lang = ? AND id = ?;
  `;

  db.query(sqlSelect, [lang, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
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
  });
};
const deleteDescriptionofBlog = (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM blog_descriptions WHERE id =?";
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.error("Error deleting description:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json("Deleted successfully");
  });
};
const getDescriptionsandimg = (req, res) => {
  const { id } = req.params;
  const sqlSelect = `
    SELECT 
      blog_descriptions.id AS description_id, 
      blog_descriptions.description AS description, 
      blog_images.id AS img_id,
      blog_images.img AS img
    FROM blog_descriptions
    LEFT JOIN blog_images ON blog_images.blog_description_id = blog_descriptions.id
    WHERE blog_descriptions.id = ?;
  `;

  db.query(sqlSelect, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: err.message });
    }

    // Initialize response structure
    const response = {
      description_id: null,
      description: null,
      images: []
    };

    // Process results to populate the response
    results.forEach((row) => {
      if (row.description_id) {
        response.description_id = row.description_id;
        response.description = row.description;
      }

      if (row.img_id) {
        response.images.push({
          id: row.img_id,
          img: row.img
        });
      }
    });

    // Return structured response
    res.status(200).json(response);
  });
};

const updateDescription = (req, res) => {
  const { id } = req.params; 
  const { description } = req.body; 

  const sqlUpdate = "UPDATE blog_descriptions SET description = ? WHERE id = ?";

  db.query(sqlUpdate, [description, id], (err, result) => {
    if (err) {
      console.error("Error updating description:", err);
      return res.status(500).json({ message: err.message });
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Description not found" });
    }

    res.status(200).json({
      message: "Description updated successfully",
      updatedDescription: description, // Include the updated description
    });
  });
};

const updateImg = (req, res) => {
  const { id } = req.params;
  const img = req.files["img"] ? req.files["img"][0].filename : null;
  const sqlUpdate =
    "UPDATE blog_images SET img = ? WHERE id = ?";
  db.query(sqlUpdate, [img, id], (err, result) => {
    if (err) {
      console.error("Error updating img:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json([{ message: "Image updated successfully", id: id, img}]);
  });
};
const deleteimgblog = (req, res) => {
  const { id } = req.params;
  const sqlDelete = "DELETE FROM blog_images WHERE id =?";
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.error("Error deleting img:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json({ message: "Image deleted successfully", id: id });
  });
}

const addimgblog = (req, res) => {
  const { blog_description_id } = req.params;
  // Ensure blog_description_id is provided
  if (!blog_description_id) {
    return res.status(400).json({ message: "Blog description ID is required." });
  }

  const images = req.files["newimg"];

  if (!images || images.length === 0) {
    return res.status(400).json({ message: "No images uploaded." });
  }

  const sqlInsert = "INSERT INTO blog_images (blog_description_id, img) VALUES (?, ?)";
  
  // Create a function to insert images
  const insertImages = (index) => {
    if (index < images.length) {
      const img = images[index].filename;
      db.query(sqlInsert, [blog_description_id, img], (err, result) => {
        if (err) {
          console.error("Error inserting img:", err);
          return res.status(500).json({ message: err.message });
        }
        insertImages(index + 1);
      });
    } else {
      res.status(200).json({ message: "Images added successfully." });
    }
  };
  // Start inserting images from the first one
  insertImages(0);
};

module.exports = {
  getblogsByLang,
  addblogs,
  updateblogs,
  getblogs,
  getblogsById,
  deleteblogs,
  // getRecentBlog,
  getblogsByIdAndLang,
  getblogsByIdAndLangForFront,
  // description and img
  deleteDescriptionofBlog,
  getDescriptionsandimg,
  updateDescription,
  updateImg,
  deleteimgblog,
  addimgblog
};
