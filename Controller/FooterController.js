const db = require("../config.js");
const fs = require("fs");
const path = require("path");

// Updated addfooter function
const addFooter = async (req, res) => {
  const { lang } = req.params;
  const {
    logo,
    description,
    support,
    terms,
    terms_link,
    privacy,
    privacy_link,
    contact,
    contact_link,
    company,
    home,
    home_link,
    services,
    services_link,
    about,
    about_link,
    career,
    career_link,
  } = req.body;

  //   if (!title || !support || !description ||logo,link  ) {
  //     return res.status(400).json({ error: "Missing value " });
  //   }

  const query =
    "INSERT INTO footer (lang, logo, description, support, terms, terms_link, privacy, privacy_link, contact, contact_link, comapny, home, home_link, services, services_link, about, about_link, career, career_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      lang,
      logo,
      description,
      support,
      terms,
      terms_link,
      privacy,
      privacy_link,
      contact,
      contact_link,
      company,
      home,
      home_link,
      services,
      services_link,
      about,
      about_link,
      career,
      career_link,
    ],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "titles added successfully",
        insertId: results.insertId,
      });
    }
  );
};

const getfooterByLang = (req, res) => {
  const { lang } = req.params;
  const sqlSelect = "SELECT * FROM footer WHERE lang = ?";
  db.query(sqlSelect, [lang], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const updatefooter = (req, res) => {
  const { lang, id } = req.params;
  const  {   logo,
  description,
  support,
  terms,
  terms_link,
  privacy,
  privacy_link,
  contact,
  contact_link,
  company,
  home,
  home_link,
  services,
  services_link,
  about,
  about_link,
  career,
  career_link,
} = req.body;
  const sqlSelect =
"SELECT * FROM footer WHERE lang = ? AND id = ?"
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
    const updatedLogo = logo !== undefined ? logo : existing.logo;
    const updatedDescription =
      description !== undefined ? description : existing.description;
      const updatedsupport =
      support !== undefined ? support : existing.support;
      const updatedterms =
      terms !== undefined ? terms : existing.terms;
      const updatedterms_link =
      terms_link !== undefined ? terms_link : existing.terms_link;
      const updatedprivacy =
      privacy !== undefined ? privacy : existing.privacy;
      const updatedprivacy_link =
      privacy_link !== undefined ? privacy_link : existing.privacy_link;
      const updatedcontact =
      contact !== undefined ? contact : existing.contact;
      const updatedcontact_link =
      contact_link !== undefined ? contact_link : existing.contact_link;
      const updatedcompany =
      company !== undefined ? company : existing.company;
      const updatedhome =
      home !== undefined ? home : existing.home;
      const updatedhome_link =
      home_link !== undefined ? home_link : existing.home_link;
      const updatedservices =
      services !== undefined ? services : existing.services;
      const updatedservices_link =
      services_link !== undefined ? services_link : existing.services_link;
      const updatedabout =
      about !== undefined ? about : existing.about;
      const updatedabout_link =
      about_link !== undefined ? about_link : existing.about_link;
      const updatedcareer =
      career !== undefined ? career : existing.career;
      const updatedcareer_link =
      career_link !== undefined ? career_link : existing.career_link;


      const sqlUpdate =
      "UPDATE footer SET logo = ?, description = ?, support = ?, terms = ?, terms_link = ?, privacy = ? , privacy_link = ?, contact = ?, contact_link = ?, company = ?, home = ?, home_link = ? , services = ?, services_link = ?, about = ?, about_link = ?, career = ?, career_link = ? WHERE lang = ? AND id = ?";
    
      db.query(
        sqlUpdate,
        [updatedLogo, updatedDescription, updatedsupport, updatedterms, updatedterms_link, updatedprivacy, updatedprivacy_link, updatedcontact, updatedcontact_link, updatedcompany, updatedhome, updatedhome_link, updatedservices, updatedservices_link, updatedabout, updatedabout_link, updatedcareer, updatedcareer_link, lang, id],
        (err, result) => {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json({ message: err.message });
          }
      
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
          }
      
          res.status(200).json({ message: "footer updated successfully" });
        }
      );
      
  });
};
const getfooter = (req, res) => {
  const sqlSelect = "SELECT * FROM footer";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
const getfooterById = (req, res) => {
  const { id } = req.params;
  const sqlSelect = "SELECT * FROM footer WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) {
      return res.json({ message: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports = {
  getfooterByLang,
  addFooter,
  updatefooter,
  getfooter,
  getfooterById,
};
