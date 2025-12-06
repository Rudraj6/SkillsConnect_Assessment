const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    if (!first_name || !last_name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    const [exists] = await pool.query(
      'SELECT id FROM users WHERE email=? OR phone=?',
      [email, phone]
    );
    if (exists.length) {
      return res.status(409).json({ message: 'Email or phone already used' });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const full_name = `${first_name} ${last_name}`;

    await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone, password, full_name) VALUES (?,?,?,?,?,?)',
      [first_name, last_name, email, phone, hashed, full_name]
    );

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('register err', err);
    return res.status(500).json({
      message: err.sqlMessage || err.message || 'Server error',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const [rows] = await pool.query(
      'SELECT id, password FROM users WHERE email=?',
      [email]
    );
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ token, expiresIn: 15 * 60 });
  } catch (err) {
    console.error('login err', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, phone, full_name FROM users WHERE id=?',
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
