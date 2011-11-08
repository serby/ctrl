var
	crypto = require('crypto');

exports.hash = function(value) {
	return crypto.createHash('sha1').update(value).digest('hex');
};

exports.saltyHash = function(salt, value) {
	return exports.hash(value + salt);
};
