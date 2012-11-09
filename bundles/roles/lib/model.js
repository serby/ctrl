var validity = require('validity')
  , schemata = require('schemata')
  , crudModel = require('crud-model')

module.exports = function(serviceLocator) {

  var save = serviceLocator.saveFactory.role()
    , schema = schemata({
        _id: {
        },
        name: {
          validators: {
            all: [validity.required]
          }
        },
        grants: {
          validators: {
            all: [validity.required]
          }
        },
        created: {
          defaultValue: function() { return new Date() }
        }
      })
    , model = crudModel('Role', save, schema)

  function createRootRole(callback) {
    model.create({ name: 'root', grants: {'*': ['*']} }, {}, callback)
  }

  function ensureRootRoleExists(callback) {
    save.find({ name: 'root'}, {}, function(error, role) {
      if (error) {
        return callback(error)
      }
      if (role.length === 0) {
        createRootRole(callback)
      } else {
        callback()
      }
    })
  }

  function loadAcl(acl, callback) {

    function addRoleToAcl(role) {
      Object.keys(role.grants).forEach(function(resource) {
        role.grants[resource].forEach(function(action) {
          serviceLocator.logger.debug('Adding grant \'' + role.name + '\\' +  resource  + '\\' + action + '\' to ACL')
          acl.grant(role.name, resource, action)
        })
      })
    }

    save.find({}, {}, function(error, roles) {
      if (error) {
        return callback(error)
      }

      roles.forEach(addRoleToAcl)

      if (typeof callback === 'function') {
        callback()
      }
    })
  }

  // Public methods
  model.ensureRootRoleExists = ensureRootRoleExists
  model.loadAcl = loadAcl

  return model
}