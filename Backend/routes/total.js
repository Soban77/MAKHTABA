const express = require('express');
const router = express.Router();
const pool = require('../db.js');

router.get('/bu',async (req,res) => {

  try
  {
    const book = await pool.query('SELECT * FROM books');
    res.json(book.rows);
  }
  catch(err)
  {
    res.status(500).json({ error: 'Database error' });
  } 

});

module.exports = router;