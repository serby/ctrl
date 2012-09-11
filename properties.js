var _ = require('lodash')
  , basePort = 3020
  ;

var properties = {
    version: '0.1.0'
  , name: 'ctrl'
  , tagline: 'ctrl CMS by Paul Serby'
  , description: 'This is the initial config'
  , keywords: 'ctrl'
  , pageTitle: 'ctrl CMS'
  , port: basePort + 1
  , email: 'paul.serby@clock.co.uk'
  , siteUrl: 'http://localhost:' + (basePort + 1)
  , logPath: __dirname + '/logs'
  , cachePath: __dirname + '/cache'
  , dataPath: __dirname + '/data'
  , binaryCachePath: '/binary/'
  , database:
    { host: '127.0.0.1'
    , port: 27017
    , name: 'ctrl-Development'
    }
  , bcryptWorkFactor: 1
  , debug: true
  , changeEmailSender: 'nobody@example.com'
};

var environmentProperties = {
    development: {}
  , testing: {
    siteUrl: 'http://localhost:' + (basePort + 2)
    , database: {
      replSet:
      { name: 'ctrl'
      , servers: [
        { host: 'localhost', port: 28000 }
        , { host: 'localhost', port: 28001 }
        ]
      }
      , name: 'ctrl-Testing'
    }
  }
  , production: {
    siteUrl: 'http://localhost:' + (basePort + 3)
    , port: basePort + 3
    , email: 'paul.serby@clock.co.uk'
    , database:
    { host: '127.0.0.1'
    , port: 27017
    , name: 'ctrl-Production'
    }
  }
};

module.exports = function(environment) {

  properties.env = environment = environment || process.env.NODE_ENV || 'development';

  if (environmentProperties[environment] === undefined) {
    throw new RangeError('No properties for environment \'' + environment + '\'');
  }
  return _.extend({}, properties, environmentProperties[environment]);
};