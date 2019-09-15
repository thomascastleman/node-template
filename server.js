
/*
	server.js: Main file used to set up server
*/

const express 			= require('express');
const app 				= express();
const mustacheExpress 	= require('mustache-express');
const bodyParser 		= require('body-parser');
const cookieParser 		= require('cookie-parser');
const session 			= require('cookie-session');
const passport			= require('passport');
const creds				= require('./credentials.js');
const sys 				= require('./settings.js');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('html', mustacheExpress());
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

// configure session
app.use(session({ 
	secret: creds.SESSION_SECRET,
	name: 'session',
	resave: true,
	saveUninitialized: true
}));

// custom middleware
app.use((req, res, next) => {
	// add default info to be transmitted in response
	res.default = {
		devMode: sys.DEV_MODE,
		isAuth: req.isAuthenticated() && req.user && req.user.local,
	};

	// add error rendering function to response object
	res.err = (raw, fri, link) => {
		res.render('error.html', { raw: raw, friendly: fri, link: link });
	}

	next();
});

// import local modules for routes / all other functionality
const auth = require('./auth.js')(app, passport);
const routes = require('./routes.js')(app);

// unhandled routes redirect to home
app.get('*', (req, res) => { res.redirect('/'); });

// start server listening
var server = app.listen(sys.PORT, function() {
	console.log('Server listening on port %d', server.address().port);
});