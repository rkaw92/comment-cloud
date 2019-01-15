'use strict';

module.exports = function(fastify, deps) {
  // TODO: Add a JSON schema.
  fastify.post('/comments/', async function(request, response) {
    const comment = await deps.commentRepository.load(request.body.entityID);
    // TODO: URL validation and normalization for subject.
    comment.post(request.body.subject, request.body.author, request.body.message, new Date());
    await deps.commentRepository.persist(comment);
    setImmediate(function() {
      deps.commentTokenMailer.sendToken(comment);
    });
    return comment;
  });
};
