const express = require('express');
const router = express.Router();
const pool = require('../db.js');

router.get('/',async (req,res) => {
  try {
    const users = await pool.query('SELECT * FROM Users');

      res.json(users.rows);
  } catch(err) {
    res.status(500).json({ error: 'Database error' });
  }

});

module.exports = router;