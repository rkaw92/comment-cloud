'use strict';

module.exports = function(router, deps) {
  // TODO: Add a JSON schema.
  router.options('/comments/', deps.siteCORS, function(req, res) {
    res.end();
  });
};
