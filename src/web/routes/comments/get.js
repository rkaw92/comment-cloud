'use strict';

const handler = require('../../../utils/handler');

module.exports = function(router, deps) {
  // TODO: Protect the author data from leaking! At the very least,
  //  the e-mail address must be hidden.
  router.get('/subjects/:subject', deps.siteCORS, handler(async function(req, res) {
    const commentsForSubject = await deps.commentRepository.find({
      subject: String(req.params.subject),
      validated: true
    }, { sort: [[ 'date', 1 ]] });
    return {
      subject: req.params.subject,
      comments: commentsForSubject.map((comment) => comment.getPublicData())
    };
  }));
};
