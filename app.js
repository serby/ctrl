// app.js is the entry point into your application in turn creates the http server.
// You can create more entry points for tools and tests as long as you add the
// same global services to the serviceLocator

var cluster = require('cluster')
  , cpus = require('os').cpus()
  , serviceLocator = require('service-locator').createServiceLocator()
  , properties = require('./properties')()
  , nodemailer = require('nodemailer')
  ;

// All application need: properties, logger and most likely a mailer for sending
// emails. saveFactory is also created here for defining data storage. The default
// bundles need all of these.
serviceLocator
  .register('properties', properties)
  .register('logger', require('./lib/logger')(properties))
  .register('mailer', nodemailer.createTransport('sendmail'))
  .register('saveFactory', {})
  ;

// Cluster is used in all but the development environment
if ((properties.env !== 'development') && (cluster.isMaster)) {

  serviceLocator.logger.info('Forking ' + cpus.length +
    ' cluster process, one per CPU');

  // Create one instance of the app (i.e. one process) per CPU
  cpus.map(function(cpu) {
    cluster.fork();
  });

  // Report child process death
  cluster.on('death', function(worker) {

    serviceLocator.logger.error('Worker ' + worker.pid + ' died', worker);

    if (worker.signalCode === null) {
      cluster.fork();
    } else {
      serviceLocator.logger.error('Not forking new process because ' +
        worker.signalCode + ' was given');
    }

  });

} else {
  // Now we create the web server
  require('./server')(serviceLocator);
}