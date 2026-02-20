const express = require('express');
const router = express.Router();
const pool = require('../db.js');

router.get('/:id',async (req,res) => {

  // await init();
  // res.json(book);
  const id = req.params.id;

  try
  {
    const book = await pool.query(`SELECT * FROM books WHERE user_id = ${id}`);
    res.json(book.rows);
  }
  catch(err)
  {
    res.status(500).json({ error: 'Database error' });
  } 

});

router.post('/',async (req,res) => {

  const newBook = req.body;
  // newBook.id = book.length+1;

  // book.push(newBook);

  // await pool.query('INSERT INTO books (id,name, "Discounted_price", "Actual_price", "Quantity") VALUES ($1, $2, $3, $4, $5)',[newBook.id, newBook.name, newBook.Discounted_price,newBook.Actual_price,newBook.Quantity]);

  try {
    await pool.query(
      'INSERT INTO books ( id, name, "Discounted_price", "Actual_price", "Quantity", user_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [ newBook.id, newBook.name, newBook.Discounted_price, newBook.Actual_price, newBook.Quantity, newBook.user_id]
    );

    // await pool.query(
    //   'INSERT INTO books (name, "Discounted_price", "Actual_price", "Quantity", user_id) VALUES ($1, $2, $3, $4, $5)',
    //   [newBook.name, newBook.Discounted_price, newBook.Actual_price, newBook.Quantity, newBook.user_id]
    // );

  } catch (err) {
    if (err.code === '23505') {
      // console.error("Unique constraint violation:", err.detail);
      // You can handle it gracefully, e.g.:
      // return res.status(400).json({ error: "Book name already exists" });
      return res.status(400).json({ error: true });

    } else {
      console.error("Database error:", err);
      return res.status(500).json({ error: 'Database error' });
      // handle other errors
    }
  }


  res.status(201).json({  message: 'Successfull'  });

});

router.patch('/',async (req,res) => {

  try {
    const changeBook = req.body;
    // const b = book.find((bo) => bo.id === parseInt(changeBook.id));

    // b.Quantity = changeBook.quantity;

    await pool.query('UPDATE books set "Quantity" = $1 WHERE id = $2',[changeBook.quantity, changeBook.id]);

    res.status(201).json({  message: 'Successfull'  });
  } catch(err) {
    res.status(500).json({ error: 'Database error' });
  }

});

router.delete('/:id',async (req,res) => {

  try {
    const id = parseInt(req.params.id);

    // const index = book.findIndex((bo) => bo.id === id);

    // book.splice(index, 1);

    await pool.query('DELETE FROM books WHERE id = $1',[id]);

    res.status(201).json({  message: 'Successfull'  });
  } catch(err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;