module.exports = {
  name: 'Main',
  description: 'Main',
  version: '0.0.1',
  publicRoute: '/',

  initialize: function(serviceLocator, done) {
    require('./controller')(serviceLocator, __dirname + '/views');

    serviceLocator.compact.addNamespace('global', __dirname + '/public/')
      .addJs('js/lib/jquery-1.7.2.min.js')
      .addJs('js/lib/module.js')
      ;

    done();
  }
};