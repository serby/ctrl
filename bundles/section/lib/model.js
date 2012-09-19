var async = require('async')
  , validity = require('validity')
  , schemata = require('schemata')
  , crudModel = require('crud-model')
  ;

module.exports = function(serviceLocator) {

  var save = serviceLocator.saveFactory.section()
    , properties = serviceLocator.properties
    ;

  var schema = schemata({
    _id: {
    },
    name: {
      validators: {
        all: [validity.required]
      }
    },
    slug: {
      validators: {
        all: [validity.required]
      }
    },
    created: {
      defaultValue: function() { return new Date(); }
    }
  });

  var model = crudModel('Section', save, schema);

  model.pre('createValidate', function(entity, callback) {
    callback(null, schema.makeDefault(entity));
  });

  model.findOne = save.findOne;

  return model;

};