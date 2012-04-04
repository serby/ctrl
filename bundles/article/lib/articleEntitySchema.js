var Validity = require('piton-validity')
  , validation = Validity.validation;

module.exports = {
  _id: {
  },
  title: {
    validators: {
      all: [validation.required]
    }
  },
  section: {
    validators: {
      all: [validation.required]
    }
  },
  slug: {
    validators: {
      all: [validation.required]
    }
  },
  summary: {
  },
  type: {
    validators: {
      all: [validation.required]
    }
  },
  body: {
    validators: {
      all: [validation.required]
    }
  },
  author: {
    validators: {
      all: [validation.required]
    }
  },
  live: {
    type: 'boolean'
  },
  comments: {
    type: 'boolean'
  },
  images: {
    type: 'array'
  },
  tags: {
    type: 'array'
  },
  created: {
    defaultValue: function() { return new Date(); }
  }
};