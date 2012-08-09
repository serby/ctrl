module.exports = {
  name: 'API',
  version: '0.0.1',
  description: 'Generate RESTful APIs from a defined Entity schema',
  initialize: function(serviceLocator, done) {
    serviceLocator.register('generateRestApi', require('./'));
    done();
  }
};
