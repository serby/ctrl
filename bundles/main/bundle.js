module.exports = {
  name: 'Main',
  description: 'Main',
  version: '0.0.1',
  publicRoute: '/main',

  initialize: function(serviceLocator, done) {
    require('./controller')(serviceLocator, __dirname + '/views');

    serviceLocator.compact.addNamespace('global', __dirname + '/public/')
      .addJs('js/lib/jquery-1.7.2.min.js')
      .addJs('js/lib/module.js')
      ;

    // This is watch recompiles your stylus. Any that you need to compile to CSS
    // need to be defined here. This is quicker than the standard middleware.
    var w = serviceLocator.stylusWatch(__dirname + '/public/css/index.styl',
      { compile: serviceLocator.stylusCompile });

    w.on('compile', function(filename) {
      serviceLocator.logger.silly('Compiling ' + filename);
    });

    done();
  }
};