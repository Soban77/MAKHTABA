const express = require('express');
const {Pool} = require('pg');
require('dotenv').config();

const app = express();
const PORT = 8002;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

// let book = [];

// let book = [{
//   id: 1,
//   name: 'Manhaj-e-Inqilab',
//   Discounted_price: 250,
//   Actual_price: 500,
//   Quantity: 2
// },
// {
//   id: 2,
//   name: 'Haqeeqat-e-Iqsam-e-Shirk',
//   Discounted_price: 75,
//   Actual_price: 150,
//   Quantity: 3
// }];

// async function init() {
//   book = await pool.query('SELECT * FROM books');
//   // console.log(book); // or assign to global variable
// }

// await init();


// let transaction = [];

// app.use();
app.use(express.static('Frontend'));
app.use(express.json());

app.get('/Users',async (req,res) => {
  const users = await pool.query('SELECT * FROM Users');

  res.json(users.rows);
});

app.get('/books',async (req,res) => {

  // await init();
  // res.json(book);

  const book = await pool.query('SELECT * FROM books');
  res.json(book.rows); 

});

app.get('/transaction',async (req,res) => {

  const transaction = await pool.query('SELECT *, TO_CHAR(time, \'HH12:MI AM\') AS formatted_time,TO_CHAR(timestamp, \'YYYY-MM-DD HH12:MI AM\') AS timestamp FROM transactions');
  res.json(transaction.rows);

});

app.get('/transaction/api',async (req,res) => {

  const transaction = await pool.query('SELECT *,TO_CHAR(date, \'YYYY-MM-DD\') AS date, TO_CHAR(time, \'HH12:MI AM\') AS time, TO_CHAR(timestamp, \'YYYY-MM-DD HH12:MI AM\') AS timestamp FROM transactions');
  res.json(transaction.rows);

});

app.post('/books',async (req,res) => {

  const newBook = req.body;
  // newBook.id = book.length+1;

  // book.push(newBook);

  // await pool.query('INSERT INTO books (id,name, "Discounted_price", "Actual_price", "Quantity") VALUES ($1, $2, $3, $4, $5)',[newBook.id, newBook.name, newBook.Discounted_price,newBook.Actual_price,newBook.Quantity]);

  try {
    await pool.query(
      'INSERT INTO books (id, name, "Discounted_price", "Actual_price", "Quantity") VALUES ($1, $2, $3, $4, $5)',
      [newBook.id, newBook.name, newBook.Discounted_price, newBook.Actual_price, newBook.Quantity]
    );
  } catch (err) {
    if (err.code === '23505') {
      // console.error("Unique constraint violation:", err.detail);
      // You can handle it gracefully, e.g.:
      // return res.status(400).json({ error: "Book name already exists" });
      return res.status(400).json({ error: true });

    } else {
      console.error("Database error:", err);
      // handle other errors
    }
  }


  res.status(201).json({  message: 'Successfull'  });

});

app.post('/transaction',async (req,res) => {

  const newTransaction = req.body;
  // transaction.push(newTransaction);

  await pool.query('INSERT INTO transactions (id, type, book_name, quantity, price, date, time, timestamp, receipt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[newTransaction.id, newTransaction.type, newTransaction.bookName, newTransaction.quantity, newTransaction.price, newTransaction.date, newTransaction.time, newTransaction.timestamp, newTransaction.receipt]);

  res.status(201).json({  message: 'Successfull'  });

});

app.patch('/books',async (req,res) => {

  const changeBook = req.body;
  // const b = book.find((bo) => bo.id === parseInt(changeBook.id));

  // b.Quantity = changeBook.quantity;

  await pool.query('UPDATE books set "Quantity" = $1 WHERE id = $2',[changeBook.quantity, changeBook.id]);

  res.status(201).json({  message: 'Successfull'  });

});

app.delete('/books/:id',async (req,res) => {

  const id = parseInt(req.params.id);

  // const index = book.findIndex((bo) => bo.id === id);

  // book.splice(index, 1);

  await pool.query('DELETE FROM books WHERE id = $1',[id]);

  res.status(201).json({  message: 'Successfull'  });
});

app.listen(PORT,() => console.log('Server Connected'));

module.exports = {
  pool 
};