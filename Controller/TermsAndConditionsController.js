const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addtermsandconditions function
// const addtermsandconditions = async (req, res) => {
//   const { lang, page_type } = req.params;
//   const {
//     main_title,
//     main_subtitle,
//     main_description,
//     tiltle_Interpretation,
//     description_Interpretation,
//     Severability_title,
//     Severability_description,
//   } = req.body;
//   const img_Interpretation =
//     req.files && req.files["img_Interpretation"]
//       ? req.files["img_Interpretation"][0].filename
//       : null;
//   const Severability_img =
//     req.files && req.files["Severability_img"]
//       ? req.files["Severability_img"][0].filename
//       : null;
//   if (
//     !lang || 
//     !page_type
//   ) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }
//   console.log(req.body)

//   const query =
//     "INSERT INTO termsandconditions (lang, page_type, main_title, main_subtitle, main_description, tiltle_Interpretation, description_Interpretation, Severability_title, Severability_description, img_Interpretation, Severability_img ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

//   db.query(
//     query,
//     [
//       lang,
//       page_type,
//       main_title,
//       main_subtitle,
//       main_description,
//       tiltle_Interpretation,
//       description_Interpretation,
//       Severability_title,
//       Severability_description,
//       img_Interpretation,
//       Severability_img,
//     ],
//     (error, results) => {
//       if (error) {
//         console.error("Error inserting data:", error);
//         return res.status(500).json({ error: "Database error" });
//       }

//       res.json({
//         message: "termsandconditions added successfully",
//         insertId: results.insertId,
//       });
//     }
//   );
// };
const getTermsAndConditionsByPage = async (req, res) => {
  const { lang, page_type } = req.params; // Extract page_type from the request parameters

  const query =
    "SELECT * FROM termsandconditions WHERE lang = ? AND page_type = ?";

  db.query(
    query,
    [lang, page_type],
    (error, results) => {
      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.json(results);
    }
  );
};
const gettermsandconditionsByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM termsandconditions WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatetermsandconditions = (req, res) => {
  const { lang, id } = req.params;
  const {
    main_title,
    main_subtitle,
    main_description,
    tiltle_Interpretation,
    description_Interpretation,
    Severability_title,
    Severability_description,
  } = req.body;

  
  const img_Interpretation =
    req.files && req.files["img_Interpretation"]
      ? req.files["img_Interpretation"][0].filename
      : null;
  const Severability_img =
    req.files && req.files["Severability_img"]
      ? req.files["Severability_img"][0].filename
      : null;

  // First, retrieve the current values
  const sqlSelect = `
    SELECT 
      main_title, 
      main_subtitle, 
      main_description, 
      tiltle_Interpretation, 
      description_Interpretation, 
      Severability_title, 
      Severability_description, 
      img_Interpretation, 
      Severability_img 
    FROM termsandconditions 
    WHERE lang = ? AND id = ?
  `;

  db.query(sqlSelect, [lang, id], (err, results) => {
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
    const updatedMainTitle =
      main_title !== undefined ? main_title : existing.main_title;
    const updatedMainsubTitle =
      main_subtitle !== undefined ? main_subtitle : existing.main_subtitle;
    const updatedMainDescription =
      main_description !== undefined
        ? main_description
        : existing.main_description;
    const updatedtiltle_Interpretation =
      tiltle_Interpretation !== undefined
        ? tiltle_Interpretation
        : existing.tiltle_Interpretation;
    const updateddescription_Interpretation =
      description_Interpretation !== undefined
        ? description_Interpretation
        : existing.description_Interpretation;
    const updatedSeverability_title =
      Severability_title !== undefined
        ? Severability_title
        : existing.Severability_title;
    const updatedSeverability_description =
      Severability_description !== undefined
        ? Severability_description
        : existing.Severability_description;
    const updatedimg_Interpretation =
      img_Interpretation !== null
        ? img_Interpretation
        : existing.img_Interpretation;
    const updatedSeverability_img =
    Severability_img !== null ? Severability_img : existing.Severability_img;

    // Construct the update SQL query
    const sqlUpdate = `
      UPDATE termsandconditions 
      SET 
        main_title = ?, 
        main_subtitle = ?, 
        main_description = ?, 
        tiltle_Interpretation = ?, 
        description_Interpretation = ?, 
        Severability_title = ?, 
        Severability_description = ?, 
        img_Interpretation = ?, 
        Severability_img = ? 
      WHERE lang = ? AND id = ? 
    `;

    db.query(
      sqlUpdate,
      [
        updatedMainTitle,
        updatedMainsubTitle,
        updatedMainDescription,
        updatedtiltle_Interpretation,
        updateddescription_Interpretation,
        updatedSeverability_title,
        updatedSeverability_description,
        updatedimg_Interpretation,
        updatedSeverability_img,
        lang,
        id
        
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

        res
          .status(200)
          .json({ message: "termsandconditions updated successfully" });
      }
    );
  });
};

// const gettermsandconditions = (req, res) => {
//   const sqlSelect = "SELECT * FROM termsandconditions";
//   db.query(sqlSelect, (err, result) => {
//     if (err) {
//       return res.json({ message: err.message });
//     }
//     res.status(200).json(result);
//   });
// };
const gettermsandconditionsById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM termsandconditions WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};

// TERMS BLACK DATA******************************

// Updated addtermsblackdata function
const addtermsblackdata = async (req, res) => {
  const { lang } = req.params;
  const { title, description,page_type } = req.body;

  if (!title || !description || !page_type) {
    return res.status(400).json({ error: "Missing value " });
  }

  const query =
    "INSERT INTO termsblackdata (lang, page_type, title, description) VALUES (?, ?, ?, ?)";

  db.query(query, [lang, page_type, title, description], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "titles added successfully",
      insertId: results.insertId,
    });
  });
};
const getTermsblackdataByPage = async (req, res) => {
  const { lang, page_type } = req.params; // Extract page_type from the request parameters

  const query =
    "SELECT * FROM termsblackdata WHERE lang = ? AND page_type = ?";

  db.query(
    query,
    [lang, page_type],
    (error, results) => {
      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.json(results);
    }
  );
};
const gettermsblackdataByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM termsblackdata WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatetermsblackdata = (req, res) => {
  const { lang, id } = req.params;
  const { title, description,page_type } = req.body;
  const sqlSelect =
    "SELECT title, description, page_type FROM termsblackdata WHERE lang = ? AND id = ?";

  db.query(sqlSelect, [lang, id], (err, results) => {
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
    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedDescription =
      description !== undefined ? description : existing.description; 
      const updatedpage_type =
      page_type !== undefined ? page_type : existing.page_type;
    const sqlUpdate =
      "UPDATE termsblackdata SET title = ?, description = ?, page_type = ? WHERE lang = ? AND id = ?";

    db.query(
      sqlUpdate,
      [updatedTitle, updatedDescription,updatedpage_type, lang, id],
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

        res
          .status(200)
          .json({ message: "termsblackdata updated successfully" });
      }
    );
  });
};
const gettermsblackdata = (req, res) => {
  const sqlSelect = "SELECT * FROM termsblackdata";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const gettermsblackdataById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM termsblackdata WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const deletetermsblackdata = (req, res) => {
  const { lang, id } = req.params;
  const sqlDelete = "DELETE FROM termsblackdata WHERE lang = ? AND id = ?";

  db.query(sqlDelete, [lang, id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No matching record found to delete" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  });
};

// TERMS BLUE DATA******************************

// Updated addtermsblackdata function
const addtermsbluedata = async (req, res) => {
  const { lang } = req.params;
  const { title, description,page_type} = req.body;

  if (!title || !description || !page_type) {
    return res.status(400).json({ error: "Missing value " });
  }

  const query =
    "INSERT INTO termsbluedata (lang, page_type, title, description) VALUES (?, ?, ?, ?)";

  db.query(query, [lang, page_type, title, description], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "termsbluedata added successfully",
      insertId: results.insertId,
    });
  });
};
const getTermsbluedataByPage = async (req, res) => {
  const { lang, page_type } = req.params; // Extract page_type from the request parameters

  const query =
    "SELECT * FROM termsbluedata WHERE lang = ? AND page_type = ?";

  db.query(
    query,
    [lang, page_type],
    (error, results) => {
      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.json(results);
    }
  );
};
const gettermsbluedataByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM termsbluedata WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatetermsbluedata = (req, res) => {
  const { lang, id } = req.params;
  const { title, description,page_type } = req.body;
  const sqlSelect =
    "SELECT title, description, page_type FROM termsbluedata WHERE lang = ? AND id = ?";

  db.query(sqlSelect, [lang, id], (err, results) => {
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
    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedDescription =
      description !== undefined ? description : existing.description;
      const updatedpage_type =
      page_type !== undefined ? page_type : existing.page_type;
    const sqlUpdate =
      "UPDATE termsbluedata SET title = ?, description = ?, page_type = ?  WHERE lang = ? AND id = ?";

    db.query(
      sqlUpdate,
      [updatedTitle, updatedDescription,updatedpage_type, lang, id],
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

        res
          .status(200)
          .json({ message: "termsbluedata updated successfully" });
      }
    );
  });
};
const gettermsbluedata = (req, res) => {
  const sqlSelect = "SELECT * FROM termsbluedata";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const gettermsbluedataById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM termsbluedata WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const deletetermsbluedata = (req, res) => {
  const { lang, id } = req.params;
  const sqlDelete = "DELETE FROM termsbluedata WHERE lang = ? AND id = ?";

  db.query(sqlDelete, [lang, id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No matching record found to delete" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  });
};


module.exports = {
  // MAIN TERMS
  gettermsandconditionsByLang,
  // addtermsandconditions,
  updatetermsandconditions,
  // gettermsandconditions,
  gettermsandconditionsById,
  getTermsAndConditionsByPage,
  // BLaCK DATA
  gettermsblackdataByLang,
  addtermsblackdata,
  updatetermsblackdata,
  gettermsblackdata,
  gettermsblackdataById,
  deletetermsblackdata,
  getTermsblackdataByPage,
   // BLUE DATA
   gettermsbluedataByLang,
   addtermsbluedata,
   updatetermsbluedata,
   gettermsbluedata,
   gettermsbluedataById,
   deletetermsbluedata,
   getTermsbluedataByPage,

};
