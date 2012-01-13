/**
 * Generate incremental integers for ids etc
 * @param {Object} connection The current database connection
 * @return {Integer} Returns that value in the callback
 */
module.exports.createSequenceManager = function(connection) {
	var collection;

	connection.collection('sequence', function(error, loadedCollection) {
		if (error) {
			throw error;
		}
		collection = loadedCollection;
	});

	function getNextSequence(sequenceName, callback) {
		collection.findAndModify({ _id: sequenceName }, [], {$inc: {sequence: 1}}, { 'new': true, upsert: true } , function(error, data) {
			if (error) {
				callback(error, null);
			} else {
				callback(null, data.sequence);
			}
		});
	}

	function removeSequence(sequenceName, callback) {
		collection.remove({ _id: sequenceName }, callback);
	}

	function setSequence(sequenceName, value, callback) {
		var intVersion = parseInt(value, 10);
		if (value !== intVersion) {
			return callback(new TypeError('Sequence value must be an integer \'' + value + '\''), null);
		}
		collection.findAndModify({ _id: sequenceName }, [], { $set: {sequence: intVersion}}, { 'new': true, upsert: true } , function(error, data) {
			if (error) {
				callback(error, null);
			} else {
				callback(null, data.sequence);
			}
		});
	}

	return {

		getNextSequence: getNextSequence,
		removeSequence: removeSequence,
		setSequence: setSequence

	};
};