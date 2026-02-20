const express = require('express');
const router = express.Router();
const pool = require('../db.js');

router.get('/:id',async (req,res) => {

  const id = req.params.id;

  try {
    const transaction = await pool.query(`SELECT *, TO_CHAR(time, \'HH12:MI AM\') AS formatted_time,TO_CHAR(timestamp, \'YYYY-MM-DD HH12:MI AM\') AS timestamp FROM transactions WHERE user_id = ${id}`);
    res.json(transaction.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }

});

router.get('/api/:id',async (req,res) => {

  const id = req.params.id;

  try {
    const transaction = await pool.query(`SELECT *,TO_CHAR(date, \'YYYY-MM-DD\') AS date, TO_CHAR(time, \'HH12:MI AM\') AS time, TO_CHAR(timestamp, \'YYYY-MM-DD HH12:MI AM\') AS timestamp FROM transactions WHERE user_id = ${id}`);
    res.json(transaction.rows);
  } catch(err) {
    res.status(500).json({ error: 'Database error' });
  }

});

router.post('/',async (req,res) => {

  try {
    const newTransaction = req.body;
    // transaction.push(newTransaction);

    await pool.query('INSERT INTO transactions (id, type, book_name, quantity, price, date, time, timestamp, receipt, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',[newTransaction.id, newTransaction.type, newTransaction.bookName, newTransaction.quantity, newTransaction.price, newTransaction.date, newTransaction.time, newTransaction.timestamp, newTransaction.receipt, newTransaction.user_id]);

    res.status(201).json({  message: 'Successfull'  });
  } catch(err) {
    res.status(500).json({ error: 'Database error' });
  }

});

module.exports = router;