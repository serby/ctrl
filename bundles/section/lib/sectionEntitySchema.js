var
  Validity = require('piton-validity'),
  validation = Validity.validation;

module.exports = {
  _id: {
  },
  name: {
    validators: {
      all: [validation.required]
    }
  },
  slug: {
    validators: {
      all: [validation.required]
    }
  },
  created: {
    defaultValue: function() { return new Date(); }
  }
};