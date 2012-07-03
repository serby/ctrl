module.exports = {
  name: 'Generic',
  version: '0.0.1',
  description: 'Generate standard administration [list, add, edit, view] views based on a defined schema',
  initialize: function(serviceLocator, done) {
    serviceLocator.register('generic',require('./'));
    done();
  }
};