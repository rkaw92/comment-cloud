'use strict';

class CommentTokenMailer {
  constructor({ commentValidator, mailTransport, mailOptions, externalURL }) {
    this._commentValidator = commentValidator;
    this._mailTransport = mailTransport;
    this._mailOptions = mailOptions;
    this._externalURL = externalURL;
  }

  _getMailOptions(comment, token) {
    const subjectURL = new URL(comment.subject);
    const validationURL = new URL(`ui/verify.html?commentID=${encodeURIComponent(comment.getEntityID())}&token=${encodeURIComponent(token)}`, this._externalURL);
    const quotedComment = comment.message.split('\n').map((line) => `> ${line}`).join('\n');
    const website = subjectURL.hostname;
    return Object.assign({}, this._mailOptions, {
      to: comment.author.email,
      subject: `Confirm your comment on ${website}`,
      text: `
Hi ${comment.author.name}!
Thank you for your comment on ${comment.subject}
To verify your comment for publishing, please visit the below link:
${validationURL}

For reference, the complete content of the comment follows:

Posted on ${comment.date.toISOString()} as ${comment.author}
${quotedComment}

---
Sincerely yours,
  Comment Bot
`.trim()
    });
  }

  async sendToken(comment) {
    const token = await this._commentValidator.getToken(comment);
    const mailOptions = this._getMailOptions(comment, token);
    return this._mailTransport.sendMail(mailOptions);
  }
}

module.exports = CommentTokenMailer;
