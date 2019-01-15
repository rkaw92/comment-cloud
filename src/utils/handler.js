'use strict';

// Turn a promise-based function into an express.js handler:
function makeHandler(actualHandler) {
  return async function _runActualHandler(req, res, next) {
    try {
      const result = await actualHandler(req, res);
      res.json(result);
    } catch (error) {
      next(error || new Error('Generic error - no error was passed'));
    }
  };
}

module.exports = makeHandler;
