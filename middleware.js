
/*
	middleware.js: Middleware
*/

const querystring = require('querystring');

module.exports = {

	// middleware to check for a URL to return to after authenticating
	checkReturnTo: (req, res, next) => {
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
	isAuthGET: (req, res, next) => {
		// if authenticated and has session data from our system
		if (req.isAuthenticated() && req.user.local) {
			return next();
		} else {
			// redirect to auth screen, with returnTo link to this page
			res.redirect('/auth/google?returnTo=' + querystring.escape(req.url));
		}
	},

	// middleware (for POST reqs) to check if auth'd
	isAuthPOST: (req, res, next) => {
		if (req.isAuthenticated() && req.user.local) {
			return next();
		} else {
			res.redirect('/');
		}
	},

	// generate a middleware function to check against a specific user role
	checkRole: (role) => {
		return (req, res, next) => {
			if (req.isAuthenticated() && req.user.local && req.user.local.role == role) {
				return next();
			} else {
				res.err("", "You are unable to access this resource.", "/auth/google?returnTo=" + querystring.escape(req.url));
			}
		};
	}

}