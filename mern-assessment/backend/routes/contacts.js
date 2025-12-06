const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const contactsController = require("../controllers/contactsController");

// GET all contacts for logged-in user
router.get("/", auth, contactsController.getContacts);

// CREATE contact
router.post("/", auth, contactsController.createContact);

// GET single contact by id (for details view)
router.get("/:id", auth, contactsController.getContactById);

// UPDATE contact
router.put("/:id", auth, contactsController.updateContact);

// DELETE contact
router.delete("/:id", auth, contactsController.deleteContact);

module.exports = router;
