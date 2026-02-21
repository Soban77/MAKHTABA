const express = require('express');
const router = express.Router();
const pool = require('../db.js');

router.get('/',async (req,res) => {
  try {
    const users = await pool.query('SELECT * FROM users');

    console.log("Backend users:", users.rows);

      res.json(users.rows);
  } catch(err) {
    console.error("DB error:", err);

    res.status(500).json({ error: 'Database error' });
  }

});

module.exports = router;