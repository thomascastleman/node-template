
/*
	settings.js: System parameters
*/

module.exports = {
	// server port
	PORT: 8080,

	// is the system in development mode
	DEV_MODE: true,

	// name of database
	DB_NAME: 'db',

	// domain through which server is accessible
    DOMAIN: 'http://localhost:8080',

    // restriction to apply to new accounts requesting access
    EMAIL_RESTRICTION: /.+?@brown\.edu$/gm

}