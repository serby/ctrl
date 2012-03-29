var jade = require('jade');

module.exports.compile = function(path) {
  var content = require('fs').readFileSync(path, 'utf8');
  return jade.compile(content, { filename: path });
};