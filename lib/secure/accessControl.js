var
	events = require('events');

/**
 * Encapsulates Authentication and Authorization.
 * Controls if the authorized user can access resources
 *
 * @author Paul Serby <paul.serby@clock.co.uk>
 */
module.exports.createAccessControl = function(authenticationProvider, authenticatedAcl, unauthenticatedAcl, type, logger) {

	// This object will extend EventEmitter
	var self = new events.EventEmitter();

	// Failover to console based loggined
	logger = logger || console;

	// Default type of authentication
	type = type || 'user';

	/**
	 * Builds the session object using the user provided
	 *
	 * @param {Object} req Request object
	 * @param {Object} user The authenticated user
	 */
	function createSession(req, user) {
		req.session[type] = user;

		req.session[type + 'JustLoggedIn'] = true;
		console.log(req.session);
		logger.info('Authenticated session created', req.session[type]);

		self.emit('session', user);
	}

	/**
	 *
	 *
	 */
	function authenticate(req, res, credentials, callback) {
		authenticationProvider.authenticate(credentials, function(error, user) {
			if (error) {
				return callback(error);
			}
			self.emit('authenticate', user);
			createSession(req, user);
			if (credentials.rememberMe) {
				setAutoAuthenticationCookie(res, user);
			}
			callback(null, user);
		});
	}

	function isAuthenticated(req) {
		return req.session && (req.session[type] !== undefined);
	}

	function canAutoAuthenticate(req) {
		var res = res;
		return isAuthenticated(req) && (res.cookie[type + 'AuthenticationId'] !== undefined);
	}

	function setAutoAuthenticationCookie(res, user) {
		res.cookie(type + 'AuthenticationId', user.authenticationId, { path: '/', expired: 90000 });
	}

	function clearAutoAuthenticationCookie(res) {
		res.clearCookie(type + 'AuthenticationId');
	}

	function isAllowed(req, res, resource, action, callback) {
		if (!req.session[type]) {
			return callback(null, false);
		}
		//TODO: Caching may give an improvement here
		if (req.session[type].roles) {
			authenticatedAcl.allowed(req.session[type].roles, resource, action, callback);
		} else {
			unauthenticatedAcl.allowed(req.session[type].roles, resource, action, callback);
		}
	}

	function access(resource, action) {
		return function(req, res, next) {

			isAllowed(req, res, resource, action, function(error, allowed) {
				if (allowed) {
					next();
				} else {
					next(new Error('Unauthorized: ' + resource + ' / ' + action));
				}
			});
		};
	}

	function destroy(req, res) {
		self.emit('destroy', req.session[type]);
		logger.info('Session Destroyed', req.session[type]);
		delete req.session[type];
		delete req.session[type + 'LastUrl'];
		clearAutoAuthenticationCookie(res);
	}

	function setBlockedRequest(req) {
		req.session[type + 'LastUrl'] = req.url;
	}

	function getLastBlockedUrl(req) {
		return req.session[type + 'LastUrl'];
	}

	self.createSession = createSession;
	self.authenticate = authenticate;
	self.isAuthenticated = isAuthenticated;
	self.canAutoAuthenticate = canAutoAuthenticate;
	self.setAutoAuthenticationCookie = setAutoAuthenticationCookie;
	self.clearAutoAuthenticationCookie = clearAutoAuthenticationCookie;
	self.isAllowed = isAllowed;
	self.destroy = destroy;
	self.setBlockedRequest = setBlockedRequest;
	self.getLastBlockedUrl = getLastBlockedUrl;
	self.access = access;

	return self;
};