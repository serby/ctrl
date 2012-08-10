var validation = require('piton-validity').validation
  , schemata = require('schemata')
  ;

module.exports = schemata({
  _id: {
  },
  name: {
    validators: {
      all: [validation.required]
    }
  },
  grants: {
    validators: {
      all: [validation.required]
    }
  },
  created: {
    defaultValue: function() { return new Date(); }
  }
});