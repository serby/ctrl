
module.exports.createAccessControlList = function(logger) {
	var
		acl = {};

	function addResource(resource, description) {
		if (acl[resource] === undefined) {
			logger.verbose('Adding resource \'' + resource + '\' to access control list');
			acl[resource] = {
				description: description,
				actions: {}
			};
		} else {
			logger.verbose('Resource \'' + resource + '\' already added');
		}
	}

	function grant(target, resource, action) {
		// Ensure the resource has been added
		if (acl[resource] === undefined) {
			throw new RangeError('Unknown resource: ' + resource);
		}
		if (acl[resource].actions[action] === undefined) {
			acl[resource].actions[action] = [target];
		} else if (acl[resource].actions[action].indexOf(target) === -1) {
			acl[resource].actions[action].push(target);
		}
	}

	function revoke(target, resource, action) {

	}

	function targetAllowed(target, resource, action) {
		return acl[resource] && acl[resource].actions[action] && acl[resource].actions[action].indexOf(target) !== -1;
	}

	function allowed(targets, resource, action, callback) {
		if (!Array.isArray(targets)) {
			targets = [targets];
		}

		for (var i = 0; i < targets.length; i++) {
			target = targets[i];
			if (targetAllowed(target, resource, action)) {
				return callback(null, true);
			}
		}

		return callback(null, false);
	}

	return {
		acl: acl,
		addResource: addResource,
		grant: grant,
		revoke: revoke,
		allowed: allowed
	};
}