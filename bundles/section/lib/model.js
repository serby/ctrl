// Sections like Categories in Wordpress can be used to divide up the content on
// your site. They are the different folders under which all other content can
// sit. i.e. **/featured** **/popular**

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
  var save = serviceLocator.saveFactory.section()
    , model

  // The data structure for our model can be defined in any way, however the
  // default in ctrl is using [schemata](https://github.com/serby/schemata)
  // which is not coupled to the persistence layer.
  var schema = schemata(
  { _id:
      {
      }
    , name:
      { validators:
        // [validity](https://github.com/serby/validity) offers a number of different validators which can be applied
        // to the properties of the object. **'all'** is the default validation set
        // when you call schema.validate(). You can however create any groups
        // such as a different validation set for when you update an object.
        { all: [validity.required]
        }
      }
    , slug:
      { validators:
        { all: [validity.required]
        }
      }
    , created:
    // *schemata* will use this value or call this function when
    // schema.makeDefault is called.
      { defaultValue: function() { return new Date() }
      }
  })

  // Because we are using *save* and *schemata* we can use
  // [crud-model](https://github.com/serby/crud-model) to make a basic create,
  // read, update, delete model that validates on create and update using the
  // defined validation sets.
  model = crudModel('Section', save, schema)

  // To ensure that all the property stored even if the model object has missing
  // properties we pass the entity through schema.makeDefault() which adds all
  // missing properties and set the default values. In this instance sets
  // created to now.
  model.pre('createValidate', function(entity, callback) {
    callback(null, schema.makeDefault(entity))
  })

  // Our application may what to use the findOne function which isn't exposed
  // via the crud model so we tack it on here:
  model.findOne = save.findOne

  return model
}