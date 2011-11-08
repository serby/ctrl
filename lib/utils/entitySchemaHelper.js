var
	validity = require('piton-validity'),
	validation = validity.validation;

/**
 * Iterates through an entity schema object and adds piton-validity required validation.
 *
 * This is so you can have 'required: true' instead of repeating the validators object.
 *
 * @author Dom Harrington <dom.harrington@clock.co.uk>
 * @param {Object} property Entity schema property
 * @param {String} key Name of property
 */
module.exports.addRequiredValidator = function(property, key) {
	if (property.required) {
		// Ensure this property has validators
		if (property.validators === undefined) {
			property.validators = { all: [] };
		}
		Object.keys(property.validators).forEach(function(key) {
			property.validators[key].unshift(validation.required);
		});
	}

	return key[property];
};