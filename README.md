# node-template
Boilerplate Node.js app with Express &amp; Google OAuth 2.0


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