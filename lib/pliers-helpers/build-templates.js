module.exports = buildTemplates

var jade = require('jade')
  , fs = require('fs')
  , dirname = require('path').dirname
  , join = require('path').join
  , relative = require('path').relative

function buildTemplates(pliers, files, root, done) {

  var count = files.length
    , templates = {}

  pliers.logger.debug('Found ' + count + ' template(s)')

  function complete() {
    if (--count === 0) write()
  }

  function write() {
    var out = ''
      , runtimePath = join(dirname(require.resolve('jade')), 'runtime.js')

    pliers.logger.debug('Getting the jade runtime')
    fs.readFile(runtimePath, function (err, data) {
      if (err) throw err
      out += data
      Object.keys(templates).forEach(function (name) {
        out += '\n'
        out +=
          [ 'window.module(\'' + name + '\', function (module) {'
          , 'module.exports = ' + templates[name]
          , '})'
          ].join('\n')
      })

      pliers.logger.debug('Bundling runtime and compiled templates to templates.js')
      fs.writeFile(join(root, 'templates.js'), out, function (err) {
        if (err) throw err
        done()
      })
    })

  }

  files.forEach(function (file) {
    pliers.logger.debug('Compiling ' + relative(root, file))
    fs.readFile(file, function (err, data) {
      if (err) throw err
      var fn = jade.compile(data, { compileDebug: false, client: true })
      templates[relative(root, file).replace(/\.jade$/, '')] = fn
      complete()
    })
  })

}