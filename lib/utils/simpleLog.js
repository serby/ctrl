module.exports.createSimpleLog = function(name, connection) {
	var collection;

	connection.collection(name, function(error, loadedCollection) {
		collection = loadedCollection;
	});

	function log(data, callback) {

		// Add a timestamp
		data.created = new Date();

		collection.insert(data, { safe: true }, function(error, storedData) {
			if (error === null) {
				console.info('Logging ' + name);
				if (typeof callback === 'function') {
					callback(null, storedData[0]);
				}
			} else {
				console.warn('Error Logging ' + name, error, storedData);
				if (typeof callback === 'function') {
					callback(error);
				}
			}
		});
	}

	return {
		log: log
	};
};