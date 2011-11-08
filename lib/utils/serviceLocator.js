module.exports.createServiceLocator = function() {
	var
		self = {};

	/**
	 * Registers a service but make it read only
	 * @param {String} name To get the service by
	 * @param {Object} service What you want to register
	 */
	function register(name, service) {

		if (self[name] !== undefined) {
			throw new Error('Service \'' + name + '\' already registered');
		}

		Object.defineProperty(self, name, {
			get: function(){ return service; }
		});
		return self;
	}

	self.register = register;

	return self;
};