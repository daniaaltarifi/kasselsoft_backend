const db = require("../config.js");
const addSubscribe = async (req, res) => {
  const { email } = req.body;

  // Basic email validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Check if email already exists
    const checkQuery = "SELECT email FROM subscribe WHERE email = ?";
    const [existing] = await db.promise().query(checkQuery, [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    // Insert new email
    const insertQuery = "INSERT INTO subscribe (email) VALUES (?)";
    await db.promise().query(insertQuery, [email]);

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error" });
  }
};



const getSubscribed = async (req, res) => {
    try {
        const query = "SELECT id, email, updated_at FROM subscribe";
        const result = await db.promise().query(query);

        const formattedResult = result[0].map(row => {
            // Create a new Date object in UTC
            const utcDate = new Date(row.updated_at + 'Z'); // Add 'Z' to indicate UTC

            // Adjust for local time zone (you can change this offset as needed)
            const offset = utcDate.getTimezoneOffset() * 60000; // Get offset in milliseconds
            const localDate = new Date(utcDate.getTime() - offset); // Adjust to local time

            // Format the date to 'YYYY-MM-DD'
            const formattedDate = localDate.toISOString().split('T')[0];

            return {
                id: row.id,
                email: row.email,
                updated_date: formattedDate // Use the formatted date
            };
        });

        res.json(formattedResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
};

const deletesSubscribed = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "DELETE FROM subscribe WHERE id=?";
    const result = await db.promise().query(query, [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "No such record found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};
module.exports = { addSubscribe, getSubscribed, deletesSubscribed };
