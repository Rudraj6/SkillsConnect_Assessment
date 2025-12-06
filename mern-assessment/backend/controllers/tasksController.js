const pool = require("../db");

// ------------------------------------
// GET all tasks for logged-in user
// ------------------------------------
exports.getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users_task WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------
// GET tasks for a specific contact
// ------------------------------------
exports.getTasksForContact = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users_task WHERE user_id = ? AND contact_id = ? ORDER BY id DESC",
      [req.user.id, req.params.contactId]
    );
    res.json(rows);
  } catch (err) {
    console.error("getTasksForContact error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------
// CREATE Task
// ------------------------------------
exports.createTask = async (req, res) => {
  try {
    const { contact_id, title, description, due_date } = req.body;

    if (!contact_id || !title) {
      return res.status(400).json({ message: "Contact & title required" });
    }

    await pool.query(
      `INSERT INTO users_task (user_id, contact_id, title, description, due_date, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        contact_id,
        title,
        description || null,
        due_date || null,
        req.user.id, // created_by as user ID
        req.user.id, // initially same for updated_by
      ]
    );

    res.json({ message: "Task created" });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------
// UPDATE Task (Fix: Allow partial updates safely)
// ------------------------------------
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Fetch current task data
    const [existingRows] = await pool.query(
      "SELECT * FROM users_task WHERE id = ? AND user_id = ?",
      [taskId, userId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existing = existingRows[0];

    // Use existing values if not provided in request
    const {
      title = existing.title,
      description = existing.description,
      status = existing.status,
      due_date = existing.due_date,
    } = req.body;

    await pool.query(
      `UPDATE users_task 
       SET title = ?, description = ?, status = ?, due_date = ?, updated_by = ?
       WHERE id = ? AND user_id = ?`,
      [title, description, status, due_date, userId, taskId, userId]
    );

    res.json({ message: "Task updated" });
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ------------------------------------
// DELETE Task
// ------------------------------------
exports.deleteTask = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM users_task WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
