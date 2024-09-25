const db = require("../config.js");
const dotenv = require("dotenv");
dotenv.config(".env");
const SECRETTOKEN = process.env.SECRETTOKEN;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10; // Define your salt rounds

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const checkEmailSql = "SELECT email FROM login WHERE email = ?";
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query(checkEmailSql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (existingUser) {
      return res.status(400).json("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertSql =
      "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const values = [name, email, hashedPassword];
    db.query(insertSql, [values], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ Error: "Inserting data error in server" });
      }
      return res.json({ Status: "SignUp Success" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ? ";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      return res.json({ Error: "Login error in server" });
    }
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "Password compare error" });
          if (response) {
            const { name } = data[0];
            const token = jwt.sign({ name }, SECRETTOKEN, { expiresIn: "1d" });
          // Set the token in a cookie
          res.cookie("token", token, {
            httpOnly: true,  // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === "production", // Use true only in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: "Strict", // Helps mitigate CSRF attacks
          });
            return res.json({ Status: "Login Succses" });
          } else {
            return res.json({ Status: "Failed", Error: "Incorect Password" });
          }
        }
      );
    } else {
      return res.json({ message: "Email Not Found", Error: "No email exists" });
    }
  });
};
const logout = async (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.json({ Status: "Logout Success" });
  };
  
module.exports = { signUp, login, logout };
