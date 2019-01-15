'use strict';

const handler = require('../../utils/handler');

module.exports = function(router, deps) {
  // TODO: Add a JSON schema.
  router.post('/comments/:entityID/validate', handler(async function(req, res) {
    const validationEngine = deps.commentValidator;
    const comment = await deps.commentRepository.load(req.params.entityID);
    const validationToken = req.body.token;
    await validationEngine.checkToken(comment, validationToken);
    comment.validate(new Date());
    await deps.commentRepository.persist(comment);
    return comment;
  }));
};
