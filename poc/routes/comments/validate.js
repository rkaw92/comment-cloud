'use strict';

module.exports = function(fastify, deps) {
  // TODO: Add a JSON schema.
  fastify.post('/comments/:entityID/validate', async function(request, response) {
    const validationEngine = deps.commentValidator;
    const comment = await deps.commentRepository.load(request.params.entityID);
    const validationToken = request.body.token;
    await validationEngine.checkToken(comment, validationToken);
    comment.validate(new Date());
    await deps.commentRepository.persist(comment);
    return comment;
  });
};
