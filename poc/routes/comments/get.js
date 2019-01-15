'use strict';

module.exports = function(fastify, deps) {
  // TODO: Add a JSON schema.
  fastify.get('/subjects/:subject', async function(request, response) {
    // TODO: Normalize the subject URL.
    const commentsForSubject = await deps.commentRepository.find({
      subject: String(request.params.subject),
      validated: true
    }, { sort: [[ 'date', 1 ]] });
    return {
      subject: request.params.subject,
      comments: commentsForSubject
    };
  });
};
