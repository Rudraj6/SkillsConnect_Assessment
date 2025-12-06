
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/email', require('./routes/email'));

// basic health check
app.get('/', (req, res) => res.send('API running'));

// global error handler (simple)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
