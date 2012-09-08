var
  _ = require('lodash'),
  basePort = 3020;

var properties = {
    version: '0.0.1'
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
  , binaryCachePath: '/image/'
  , database:
    { host: '127.0.0.1'
    , port: 27017
    , name: 'ctrl-Development'
    }
  , defaultSearchResultSize: 30
  , bcryptWorkFactor: 1
  , debug: true
  , changeEmailSender: 'nobody@example.com'
};

var environmentProperties = {
    development: {}
  , testing: {
    siteUrl: 'http://localhost:' + (basePort + 2)
    , port: basePort + 2,
    hosts: [
      { host: 'localhost'
      , sshPort: 22
      }
    ]
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
    , hosts: [
      { host: ''
      , sshPort: 17510
      }
    ]
    , database:
    { host: '127.0.0.1'
    , port: 27017
    , name: 'ctrl-Production'
    }
  }
};

function getEnv() {
  return process.env.NODE_ENV || 'development';
}

exports.getProperties = function(environment) {
  environment = environment || getEnv();
  properties.env = environment;

  if (environmentProperties[environment] === undefined) {
    throw new RangeError('No properties for environment \'' + environment + '\'');
  }
  return _.extend({}, properties, environmentProperties[environment]);
};