var validation = require('piton-validity').validation
  , schemata = require('schemata')
  ;

module.exports = schemata({
  _id: {
    tag: ['update']
  },
  emailAddress  : {
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
    },
    tag: ['password']
  },
  roles: {
    type: Array,
    tag: ['update']
  },
  created: {
    defaultValue: function() { return new Date(); }
  }
});
