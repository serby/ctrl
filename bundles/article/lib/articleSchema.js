var validation = require('piton-validity').validation
  , schemata = require('schemata')
  ;

module.exports = schemata({
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
    type: Boolean
  },
  comments: {
    type: Boolean
  },
  images: {
    type: Array
  },
  tags: {
    type: Array
  },
  created: {
    defaultValue: function() { return new Date(); }
  },
  publishedDate: {
    defaultValue: function() { return new Date(); },
    type: Date
  }
});