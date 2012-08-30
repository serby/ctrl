var Pipe = require('piton-pipe')
  , emptyFn = function() {}
  ;

module.exports = function(name, save, schema, options) {

  var slug = (options && options.slug) ? options.slug : name.toLowerCase().replace(/ /g, '');

  var pre = {
    create: Pipe.createPipe(),
    createValidate: Pipe.createPipe(),
    update: Pipe.createPipe(),
    updateValidate
    : Pipe.createPipe(),
    'delete': Pipe.createPipe()
  };

  if (schema.schema[save.idProperty] === undefined) {
    throw new Error();
  }

  return {
    name: name,
    slug: slug,
    schema: schema,
    idProperty: save.idProperty,
    create: function(object, validateOptions, callback) {
      callback = callback || emptyFn;

      var cleanObject = schema.cast(schema.stripUnknownProperties(object));

      pre.createValidate.run(cleanObject, function(error, pipedObject) {
        if (error) {
          return callback(error);
        }
        schema.validate(pipedObject, validateOptions, function(error, validationErrors) {
          if (error) {
            return callback(error);
          }
          if (Object.keys(validationErrors).length > 0) {
            var validationError = new Error('Validation Error');
            validationError.errors = validationErrors;
            return callback(validationError);
          }
          pre.create.run(pipedObject, function(error, pipedObject) {
            if (error) {
              return callback(error);
            }
            save.create(pipedObject, function(error, savedObject) {
              if (error) {
                return callback(error);
              }
              callback(undefined, savedObject);
            });
          });
        });
      });
    },
    read: save.read,
    update: function(object, validateOptions, callback) {
      callback = callback || emptyFn;

      var cleanObject = schema.cast(schema.stripUnknownProperties(object));

      pre.updateValidate.run(cleanObject, function(error, pipedObject) {
        if (error) {
          return callback(error);
        }
        schema.validate(pipedObject, validateOptions, function(error, validationErrors) {
          if (error) {
            return callback(error);
          }
          if (Object.keys(validationErrors).length > 0) {
            var validationError = new Error('Validation Error');
            validationError.errors = validationErrors;
            return callback(validationError);
          }
          pre.update.run(pipedObject, function(error, pipedObject) {
            if (error) {
              return callback(error);
            }
            save.update(pipedObject, function(error, savedObject) {
              if (error) {
                return callback(error);
              }
              callback(undefined, savedObject);
            });
          });
        });
      });
    },
    'delete': function(id, callback) {
      save['delete'](id, callback);
    },
    count: save.count,
    find: save.find,
    pre: function(method, processor) {
      return pre[method].add(processor);
    }
  };
};