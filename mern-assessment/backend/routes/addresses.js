const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const address = require("../controllers/addressController");

router.get("/:contactId", auth, address.getAddresses);         // list
router.post("/:contactId", auth, address.createAddress);       // create
router.put("/:id", auth, address.updateAddress);               // update
router.delete("/:id", auth, address.deleteAddress);            // delete

module.exports = router;
