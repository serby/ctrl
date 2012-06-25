var Validity = require('piton-validity')
  , validation = Validity.validation;

module.exports = {
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
  created: {
    defaultValue: function() { return new Date(); }
  }
};