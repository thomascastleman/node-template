
/* 
	auth.js: Authentication routes / configurations and middleware for restricting pages / requests to various levels of authentication
*/

const GoogleStrategy 	= require('passport-google-oauth20').Strategy;
const querystring 		= require('querystring');
const db 				= require('./database.js');
const con 				= db.connection;
const sys				= require('./settings.js');
const creds 			= require('./credentials.js');

module.exports = {

	// set up routes and configure authentication settings
	init: (app, passport) => {

		// cache user info from our system into their session
		passport.serializeUser((user, done) => {
			const email = user._json.email;

			// attempt to locate existing user account by email
			db.lookUpUser(email, (err, profile) => {
				if (!err) {
					// cache profile in session
					user.local = profile;

					// pass through
					done(null, user);

				// if email considered valid or no restriction applied to new user accounts
				} else if (!sys.EMAIL_RESTRICTION || sys.EMAIL_RESTRICTION.test(email)) {
					// add new user account
					db.addUserFromGoogle(user, (err, profile) => {
						// cache profile
						user.local = profile;
						
						// pass through
						done(null, user);
					});
				} else {
					done("The system failed to find an account associated with the given email (" + email + ")", null);
				}
			});
		});

		passport.deserializeUser((user, done) => {
			done(null, user);
		});

		// Google OAuth2 config with passport
		passport.use(new GoogleStrategy({
				clientID:		creds.GOOGLE_CLIENT_ID,
				clientSecret:	creds.GOOGLE_CLIENT_SECRET,
				callbackURL:	sys.DOMAIN + "/auth/google/callback",
				passReqToCallback: true,

				// tells passport to use userinfo endpoint instead of Google+
				userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
			},
			(request, accessToken, refreshToken, profile, done) => {
				process.nextTick(() => {
					return done(null, profile);
				});
			}
		));

		app.use(passport.initialize());
		app.use(passport.session());

		// authentication with Google endpoint
		app.get('/auth/google', module.exports.checkReturnTo, passport.authenticate('google', { 
			scope: [
				'profile',
				'email'
			],
			prompt: 'select_account'	// tells Google to always make user select account
		}));

		// callback for google auth
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successReturnToOrRedirect: '/',
				failureRedirect: '/failure'
		}));

		// handler for failure to authenticate
		app.get('/failure', (req, res) => {
			res.err("", "Unable to authenticate.");
		});

		// logout handler
		app.get('/logout', module.exports.checkReturnTo, (req, res) => {
			req.logout();
			res.redirect(req.session.returnTo || '/');
		});

		return module.exports;
	},

	// middleware to check for a URL to return to after authenticating
	checkReturnTo: function(req, res, next) {
		var returnTo = req.query['returnTo'];
		if (returnTo) {
			// if no session, replace with empty object
			if (!req.session) req.session = {};

			// add returnTo address to session
			req.session.returnTo = querystring.unescape(returnTo);
		}
		next();
	},

	// middleware to restrict pages to authenticated users
	isAuthGET: function(req, res, next) {
		// if authenticated and has session data from our system
		if (req.isAuthenticated() && req.user.local) {
			return next();
		} else {
			// redirect to auth screen, with returnTo link to this page
			res.redirect('/auth/google?returnTo=' + querystring.escape(req.url));
		}
	},

	// middleware (for POST reqs) to check if auth'd
	isAuthPOST: function(req, res, next) {
		if (req.isAuthenticated() && req.user.local) {
			return next();
		} else {
			res.redirect('/');
		}
	},

	// middleware to restrict pages to admin users
	isAdminGET: function(req, res, next) {
		// if authenticated and has session data
		if (req.isAuthenticated() && req.user.local) {
			// if administrator, allow
			if (req.user.local.isAdmin) {
				return next();
			} else {
				res.redirect('/');
			}
		} else {
			res.redirect('/auth/google?returnTo=' + querystring.escape(req.url));
		}
	},

	// middleware (for POSTs) to check if requester is admin
	isAdminPOST: function(req, res, next) {
		if (req.isAuthenticated() && req.user.local && req.user.local.isAdmin) {
			return next();
		} else {
			res.redirect('/');
		}
	}

}