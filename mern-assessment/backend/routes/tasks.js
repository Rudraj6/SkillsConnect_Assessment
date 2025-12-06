const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const tasksController = require("../controllers/tasksController");

// Get all tasks for the authenticated user
router.get("/", auth, tasksController.getTasks);

// Get all tasks for a specific contact
router.get("/contact/:contactId", auth, tasksController.getTasksForContact);

// Create a task with created_by tracking
router.post("/", auth, (req, res, next) => {
  req.body.created_by = req.user.id;
  req.body.updated_by = req.user.id;
  tasksController.createTask(req, res, next);
});

// Update a task with updated_by tracking
router.put("/:id", auth, (req, res, next) => {
  req.body.updated_by = req.user.id;
  tasksController.updateTask(req, res, next);
});

// Delete a task
router.delete("/:id", auth, tasksController.deleteTask);

module.exports = router;
