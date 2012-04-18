var cluster = require('cluster')
  , cpus = require('os').cpus()
  , serviceLocator = require('service-locator').createServiceLocator()
  , properties = require('./properties').getProperties()
  , nodemailer = require('nodemailer');

serviceLocator
    .register('properties', properties)
    .register('mailer', nodemailer.send_mail)
    .register('logger', require('./lib/logger').createLogger(properties));

if ((properties.env !== 'development') && (cluster.isMaster)) {

  serviceLocator.logger.info('Forking ' + cpus.length + ' cluster process, one per CPU');

  // In production use cluster to create one process per CPU
  cpus.map(function(cpu) {
    cluster.fork();
  });

  // Report child process death
  cluster.on('death', function(worker) {

    serviceLocator.logger.error('Worker ' + worker.pid + ' died', worker);

    if (worker.signalCode === null) {
      cluster.fork();
    } else {
      serviceLocator.logger.error('Not forking new process because ' + worker.signalCode + ' was given');
    }


  });

} else {
  require('./server').createServer(properties, serviceLocator);
}