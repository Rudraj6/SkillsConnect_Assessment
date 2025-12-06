const pool = require("../db");

// ------------------------------------
// GET all addresses for a contact
// ------------------------------------
exports.getAddresses = async (req, res) => {
  try {
    const contactId = req.params.contactId;

    const [rows] = await pool.query(
      `SELECT * FROM contact_address WHERE contact_id = ? ORDER BY id DESC`,
      [contactId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getAddresses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------
// CREATE address (with created_by = user ID)
// ------------------------------------
exports.createAddress = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const {
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country
    } = req.body;

    if (!address_line1 || !city || !state || !pincode || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await pool.query(
      `INSERT INTO contact_address 
        (contact_id, address_line1, address_line2, city, state, pincode, country, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        contactId,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        country,
        req.user.id,   // created_by
        req.user.id    // updated_by (same as created_by initially)
      ]
    );

    res.json({ message: "Address added" });
  } catch (err) {
    console.error("createAddress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------
// UPDATE address (with updated_by = user ID)
// ------------------------------------
exports.updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const {
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country
    } = req.body;

    await pool.query(
      `UPDATE contact_address 
       SET address_line1 = ?, address_line2 = ?, city = ?, state = ?, pincode = ?, country = ?, updated_by = ?
       WHERE id = ?`,
      [
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        country,
        req.user.id, // updated_by
        addressId
      ]
    );

    res.json({ message: "Address updated" });
  } catch (err) {
    console.error("updateAddress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------
// DELETE address
// ------------------------------------
exports.deleteAddress = async (req, res) => {
  try {
    await pool.query("DELETE FROM contact_address WHERE id = ?", [req.params.id]);
    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error("deleteAddress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
