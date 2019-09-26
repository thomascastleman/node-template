
/*
  settings.js: System parameters
*/

module.exports = {

  // server port
  PORT: 8080,

  // is the system in development mode (explicit error messages, etc)
  DEV_MODE: true,

  // name of database
  DB_NAME: 'db',

  // domain through which server is accessible
  DOMAIN: 'http://localhost:8080',

  /*  does the system allow automatic creation of new user accounts
      when authentication is attempted. */
  ALLOW_NEW_ACCOUNTS: true,

  /*  regex restriction to apply to emails of new accounts requesting access 
      (only if automatic creation enabled) */
  EMAIL_RESTRICTION: /.+?@brown\.edu$/gm,

  // name of this system
  SYSTEM_NAME: 'Template System'

}