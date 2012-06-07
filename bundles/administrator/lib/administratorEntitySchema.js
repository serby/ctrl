var
  Validity = require('piton-validity'),
  validation = Validity.validation;

module.exports = {
  _id: {
    tag: ['update']
  },
  emailAddress: {
    validators: {
      all: [validation.required, validation.email]
    },
    tag: ['update']
  },
  firstName: {
    validators: {
      all: [validation.required]
    },
    tag: ['update']
  },
  lastName: {
    validators: {
      all: [validation.required]
    },
    tag: ['update']
  },
  password: {
    validators: {
      all: [validation.required]
    }
  },
  roles: {
    type: 'array',
    tag: ['update']
  },
  created: {
    defaultValue: function() { return new Date(); }
  }
};