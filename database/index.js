const Database = require('./db');
const argv     = require('minimist')(process.argv.slice(2));

const db = new Database(argv.db || 'mongodb://localhost:27017');

(async function () {
  try {
    await db.connect(argv.dbName || 'test_database');
    console.log('Database connected');
  }
  catch (e) {
    console.error('Database connect error', e);
  }
})();

module.exports = db;