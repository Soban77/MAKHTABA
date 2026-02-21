const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(express.static('Frontend'));
app.use(express.json());

app.use('/users', require('./routes/user'));
app.use('/books', require('./routes/books'));
app.use('/transaction', require('./routes/transaction'));
app.use('/total', require('./routes/total'));

// app.get('/count', async (req,res) => {

//   try
//   {
//     const book = await pool.query(`SELECT COUNT(id) AS total_books FROM books`);
//     res.json({ total_books: book.rows[0].total_books });
//   }
//   catch(err)
//   {
//     res.status(500).json({ error: 'Database error' });
//   }

// });

app.listen(PORT,() => console.log('Server Connected'));