var validation = require('piton-validity').validation
  , schemata = require('schemata')
  ;

module.exports = schemata({
  _id: {
  },
  size: {
    validators: {
      all: [validation.required]
    }
  },
  type: {
    validators: {
      all: [validation.required]
    }
  },
  path: {
    validators: {
      all: [validation.required]
    }
  },
  basename: {
    validators: {
      all: [validation.required]
    }
  },
  title: {
    defaultValue: ''
  },
  description: {
    defaultValue: ''
  },
  tags: {
    defaultValue: ''
  },
  created: {
    type: Date,
    defaultValue: function() { return new Date(); }
  }
});