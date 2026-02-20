const {pool} = require('./index.js');
const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(path.join(__dirname,'init.sql'),'utf-8');

(async () => {
  try {
    await pool.query(sql);
    console.log('Schema Initialised!');
  }
  catch(err) {
    console.log(err);
  }
})();