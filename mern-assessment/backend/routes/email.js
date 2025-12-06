// routes/email.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// test route to confirm router works
router.post('/send', auth, (req, res) => {
  res.json({ message: "Email route working!" });
});

module.exports = router;
