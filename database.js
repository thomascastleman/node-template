
/*
  database.js: Database connection & query functions
*/

const creds   = require('./credentials.js');
const sys     = require('./settings.js');
const mysql   = require('mysql');

// establish database connection
const con = mysql.createPool({
  host: 'localhost',
  user: creds.MYSQL_USERNAME,
  password: creds.MYSQL_PASSWORD,
  database: sys.DB_NAME,
  multipleStatements: true
});

module.exports = {
  connection: con,

  // look up a user account by email
  lookUpUser: (email, cb) => {
    cb();
  },

  /*  Add a new system user account, given the user's Google info.
    Callback on profile of created user. */
  addUserFromGoogle: (user, cb) => {
    cb();
  }
}