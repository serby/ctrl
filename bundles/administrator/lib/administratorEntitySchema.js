var
	Validity = require('piton-validity'),
	validation = Validity.validation;

module.exports = {
	_id: {
	},
	emailAddress: {
		validators: {
			all: [validation.required, validation.email]
		}
	},
	firstName: {
		validators: {
			all: [validation.required]
		}
	},
	lastName: {
		validators: {
			all: [validation.required]
		}
	},
	password: {
		validators: {
			all: [validation.required]
		}
	},
	roles: {
		type: 'array'
	},
	created: {
		defaultValue: function() { return new Date(); }
	}
};