var bcrypt = require('bcrypt')
  , crypto = require('crypto')
  , validity = require('validity')
  , schemata = require('schemata')
  , crudModel = require('crud-model')

module.exports = function(serviceLocator) {

  var save = serviceLocator.saveFactory.administrator()
    , properties = serviceLocator.properties

  function duplicateEmailValidator(key, errorProperty, object, callback) {
    save.findOne({ emailAddress: object.emailAddress }, function(error, found) {
      if (error) {
        return callback(error)
      }
      callback(undefined, found && found._id.toString() !== object._id ?
        object.emailAddress + ' already in use' : undefined)
    })
  }

  var schema = schemata({
    _id: {
      tag: ['update']
    },
    emailAddress  : {
      validators: {
        all: [validity.required, validity.email, duplicateEmailValidator]
      },
      tag: ['update']
    },
    firstName: {
      validators: {
        all: [validity.required]
      },
      tag: ['update']
    },
    lastName: {
      validators: {
        all: [validity.required]
      },
      tag: ['update']
    },
    password: {
      validators: {
        all: [validity.required]
      },
      tag: ['password']
    },
    roles: {
      type: Array,
      tag: ['update']
    },
    created: {
      defaultValue: function() { return new Date() }
    }
  })

  var model = crudModel('Administrator', save, schema)

  if (typeof properties.bcryptWorkFactor === 'number' && properties.bcryptWorkFactor >= 1) {
    properties.bcryptWorkFactor = Math.round(properties.bcryptWorkFactor)
  } else {
    properties.bcryptWorkFactor = 1
  }

  function bcryptHash(value, callback) {
    bcrypt.hash(value, properties.bcryptWorkFactor, callback)
  }

  function passwordHasher(entity, callback) {
    if (entity.password) {
      bcryptHash(entity.password, function(err, hash) {
        if (err) {
          callback(err)
        } else {
          entity.password = hash
          callback(null, entity)
        }
      })
    } else {
      callback(null, entity)
    }
  }

  function authenticate(credentials, callback) {
    save.findOne({ emailAddress: credentials.emailAddress }, function(err, entity) {
      if (err) {
        return callback(err, credentials)
      } else if (!entity) {
        return callback(new Error('Wrong Email and password combination.'), credentials)
      }
      if (!entity.password) {
        return callback(new Error('No password for user. Reset required.'), credentials)
      }
      bcrypt.compare(credentials.password, entity.password, function(err, match) {
        if (err) {
          return callback(err, credentials)
        } else if (!match) {
          return callback(new Error('Wrong Email and password combination.'), credentials)
        }

        return callback(undefined, entity)
      })
    })
  }

  function dontSetBlankPassword(entity, callback) {
    if (entity.password === '') {
      delete entity.password
    }
    callback(undefined, entity)
  }

  function hashAdminState(admin) {
    var str = admin.created + ':' + admin.emailAddress + ':' + admin.password
    return crypto.createHash('sha1').update(str).digest('hex')
  }

  function requestPasswordChange(entity, callback) {
    var hash = hashAdminState(entity)
      , url = properties.siteUrl + '/admin/change-password?token=' + hash

    var mail = {
      to: entity.emailAddress,
      from: properties.changeEmailSender,
      subject: 'Password reset confirmation',
      html: '<!doctype html><html><body>To complete the password changing process for your account at ' +
            properties.name + ', please click the link below.<br>If you no longer need to change your ' +
            'password, no action is required.<br><br><a href="' + url + '">' + url + '</a></body></html>'
    }

    serviceLocator.mailer.sendMail(mail, callback)
  }

  function findByHash(hash, callback) {
    save.find({}, {}, function(err, admins) {
      if (err) {
        return callback(err)
      }

      var match = null

      admins.every(function(admin) {
        if (hashAdminState(admin) === hash) {
          match = admin
        }

        // continue until we find a match
        return (match != null)
      })

      callback(null, match)
    })
  }

  /**
   * Create a new administrator with the '*' role which
   * will allow full access to all admin bundles that have been created correctly
   */
  function createWithFullAccess(administratorDetails, callback) {

    administratorDetails.roles = ['root']

    model.create(administratorDetails, {}, callback)
  }

  model.pre('createValidate', function(entity, callback) {
    callback(null, schema.makeDefault(entity))
  })

  model.pre('create', passwordHasher)
  model.pre('update', passwordHasher)
  model.pre('update', dontSetBlankPassword)

  model.authenticate = authenticate
  model.requestPasswordChange = requestPasswordChange
  model.findByHash = findByHash
  model.createWithFullAccess = createWithFullAccess

  model.findOne = save.findOne

  return model
}