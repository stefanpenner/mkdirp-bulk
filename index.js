var path = require('path');
var unique = require('./lib/unique');
var fs = require('fs');

module.exports = function() {
  throw TypeError('only sync is currrently implemented');
};

module.exports.sync = function(paths) {
  var count = 0;
  var created = {};
  unique(paths.map(path.dirname)).map(function(path) {
    path.split('/').reduce(function(current, next) {
      if (current) {
        current = current + '/' + next;
      } else {
        current = next;
      }

      if (!created[current]) {
        try {
          count++;
          created[current] = true;
          fs.mkdirSync(current);
        } catch(e) {
          if (e.code !== 'EEXIST') {
            throw e;
          }
        }
      }

      return current;
    }, '');
  });

  return count;
};
