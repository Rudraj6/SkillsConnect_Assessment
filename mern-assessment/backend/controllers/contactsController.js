const pool = require("../db");

/* -----------------------------------------
   Get All Contacts for Logged-in User
----------------------------------------- */
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, contact_name, contact_number, contact_email, note
       FROM users_contact
       WHERE user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getContacts error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------
   Create New Contact
----------------------------------------- */
exports.createContact = async (req, res) => {
  try {
    const { contact_name, contact_number, contact_email, note } = req.body;

    if (!contact_name || !contact_number) {
      return res.status(400).json({ message: "Name and number required" });
    }

    const userId = req.user.id;

    await pool.query(
      `INSERT INTO users_contact 
       (user_id, contact_name, contact_number, contact_email, note, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, contact_name, contact_number, contact_email || null, note || null, userId] // ✅ pass userId
    );

    res.json({ message: "Contact created" });
  } catch (err) {
    console.error("createContact error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------
   Get Single Contact by ID
----------------------------------------- */
exports.getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, contact_name, contact_number, contact_email, note
       FROM users_contact
       WHERE id = ? AND user_id = ?`,
      [contactId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getContactById error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------
   Update Contact
----------------------------------------- */
exports.updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.user.id;
    const { contact_name, contact_email, contact_number, note } = req.body;

    // Check if contact belongs to this user
    const [existing] = await pool.query(
      "SELECT id FROM users_contact WHERE id = ? AND user_id = ?",
      [contactId, userId]
    );

    if (!existing.length) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Fetch full name of the user for updated_by
    const [[user]] = await pool.query(
      "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users WHERE id = ?",
      [userId]
    );

    await pool.query(
      `UPDATE users_contact
       SET contact_name = ?, contact_number = ?, contact_email = ?, note = ?, updated_by = ?
       WHERE id = ? AND user_id = ?`,
      [contact_name, contact_number, contact_email || null, note || null, user.full_name, contactId, userId]
    );

    res.json({ message: "Contact updated" });
  } catch (err) {
    console.error("updateContact error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------
   Delete Contact
----------------------------------------- */
exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.user.id;

    // Check if contact belongs to this user
    const [existing] = await pool.query(
      "SELECT id FROM users_contact WHERE id = ? AND user_id = ?",
      [contactId, userId]
    );

    if (!existing.length) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await pool.query("DELETE FROM users_contact WHERE id = ?", [contactId]);

    // Due to ON DELETE CASCADE, related addresses/tasks will also be cleaned
    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error("deleteContact error", err);
    res.status(500).json({ message: "Server error" });
  }
};
