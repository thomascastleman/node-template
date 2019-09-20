# node-template
Boilerplate Node.js app with Express &amp; Google OAuth 2.0

### Note

- Please rename the database (in `db.sql` and `settings.js`).
- Please update most everything in `settings.js` to reflect your system


### `credentials.js`

The file `credentials.js` contains sensitive information and should be formatted as follows:

```javascript
/*
  credentials.js: System credentials
*/

module.exports = {

  // Google OAuth2 credentials for user authentication
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: '',

  // session encryption secret
  SESSION_SECRET: '',

  // MySQL credentials
  MYSQL_USERNAME: '',
  MYSQL_PASSWORD: '',

}
```

### Database

Build the database with `SOURCE db.sql;`.

Make sure to `GRANT ALL PRIVILEGES ON <DB NAME>.* TO '<DB USER>'@'localhost';` and `FLUSH PRIVILEGES;` before attempting to run the software.

The database comes with two tables: `users` and `roles`. These are the bare minimum, and can be modified and expanded as necessary.