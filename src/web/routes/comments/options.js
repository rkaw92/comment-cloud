'use strict';

module.exports = function(router, deps) {
  router.options('/subjects/:subject', deps.siteCORS, function(req, res) {
    res.end();
  });
  router.options('/subjects/:subject/comments', deps.siteCORS, function(req, res) {
    res.end();
  });
};
