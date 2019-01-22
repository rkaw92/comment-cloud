'use strict';

module.exports = [
  // TODO: Turn this into a hierarchy, so that it bears more resemblance to
  //  what you'd typically find in a serverless app repository.
  require('./comments/get'),
  require('./comments/options'),
  require('./comments/post'),
  require('./comments/verify')
];
