const {pool} = require('./index.js');

async function loadBook() {

  let book = await pool.query('SELECT * FROM books');

  return book.rows;
}

module.exports = {
  loadBook
};
  