module.exports = {
  name: 'Main',
  description: 'Main',
  version: '0.0.1',
  publicRoute: '/main',

  initialize: function(serviceLocator, done) {

    var compact = require('compact').createCompact({
      srcPath: __dirname + '/public/',
      destPath: __dirname + '/public/js/compact/',
      webPath: serviceLocator.versionator.versionPath('/main/js/compact/'),
      debug: serviceLocator.properties.debug
    });

    serviceLocator.register('compact', compact);

    require('./controller')(serviceLocator, __dirname + '/views');

    serviceLocator.compact.addNamespace('global', __dirname + '/public/')
      .addJs('/js/lib/module.js')
      ;

    serviceLocator.register('errorPage', __dirname + '/views/error')

    // This is watch recompiles your stylus. Any that you need to compile to CSS
    // need to be defined here. This is quicker than the standard middleware.
    var w = serviceLocator.stylusWatch(__dirname + '/public/css/index.styl',
      { compile: serviceLocator.stylusCompile });

    w.on('compile', function(filename) {
      serviceLocator.logger.debug('Compiling ' + filename);
    });

    done();
  }
};