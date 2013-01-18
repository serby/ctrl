module.exports = scriptLoader

function scriptLoader(toLoad) {

  toLoad = toLoad.map(function (path) {
    return '/admin/js/build/' + path
  })

  var source =
    [ '(function () {'
    , 'function done() {'
    , '  require(\'index\')'
    , '}'
    , 'function error(name) {'
    , '  return function(res, errmsg, err) {'
    , '    console.log(\'Error with script: \' + name)'
    , '    throw err'
    , '  }'
    , '}'
    , 'var count = {i}'
    , 'function success() {'
    , '  if (--count === 0) done()'
    , '}'
    , '$.each([{urls}], function () {'
    , '  $.ajax({'
    , '    url: this,'
    , '    dataType: \'script\','
    , '    success: success,'
    , '    error: error(this)'
    , '  })'
    , '})'
    , '}())'
    ].join('\n')

  return source
    .replace(/\{i\}/, toLoad.length)
    .replace(/\{urls\}/, '\'' + toLoad.join('\', \'') + '\'')

}