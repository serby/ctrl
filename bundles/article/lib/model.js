var validity = require('validity')
  , schemata = require('schemata')
  , crudModel = require('crud-model')

// We work really hard to keep the dependencies for models down to make testing
// easier. Anything we do need should come through
// [serviceLocator](https://github.com/serby/service-locator) so we can easily
// mock it out.
module.exports = function(serviceLocator) {

  // Buy default our persistence in ctrl is via the
  // [save](https://github.com/serby/save) module.
  // To make this easily mockable the dependency is got from the saveFactory in
  // the [serviceLocator](https://github.com/serby/service-locator)
  var save = serviceLocator.saveFactory.article()
    , model

  // The data structure for our model can be defined in any way, however the
  // default in ctrl is using [schemata](https://github.com/serby/schemata)
  // which is not coupled to the persistence layer.
  var schema = schemata(
    {
    _id: {
    },
    title: {
      validators: {
        all: [validity.required]
      }
    },
    section: {
      validators: {
        all: [validity.required]
      }
    },
    slug: {
      validators: {
        all: [validity.required]
      }
    },
    path: {
      validators: {
        all: [validity.required]
      }
    },
    summary: {
    },
    type: {
      validators: {
        all: [validity.required]
      }
    },
    body: {
      validators: {
        all: [validity.required]
      }
    },
    author: {
      validators: {
        all: [validity.required]
      }
    },
    live: {
      type: Boolean,
      defaultValue: false
    },
    comments: {
      type: Boolean,
      defaultValue: true
    },
    images: {
      type: Array
    },
    tags: {
      type: Array
    },
    created: {
      defaultValue: function() { return new Date(); },
      type: Date
    },
    publishedDate: {
      defaultValue: function() { return new Date(); },
      type: Date
    }
  })

  // Because we are using *save* and *schemata* we can use
  // [crud-model](https://github.com/serby/crud-model) to make a basic create,
  // read, update, delete model that validates on create and update using the
  // defined validation sets.
  model = crudModel('Article', save, schema)

  // To ensure that all the property stored even if the model object has missing
  // properties we pass the entity through schema.makeDefault() which adds all
  // missing properties and set the default values. In this instance sets
  // created to now.
  model.pre('createValidate', function(entity, callback) {
    callback(null, schema.makeDefault(entity))
  })

  model.pre('createValidate', function(entity, callback) {
    callback(null, schema.makeDefault(entity))
  })

  function addPath(entity, callback) {
    entity.path = '/' + entity.section + '/' + entity.slug
    callback(null, entity)
  }

  model.pre('createValidate', addPath)
  model.pre('updateValidate', addPath)

  // This should always be called by the frontend to ensure only live articles
  // are shown.
  function findLive(query, options, callback) {

    // Ensuring all queries shown to the front end are live
    query.live = true

    model.find(query, options, callback)
  }

  model.findLive = findLive

  // Our application may what to use the findOne function which isn't exposed
  // via the crud model so we tack it on here:
  model.findOne = save.findOne

  return model
}