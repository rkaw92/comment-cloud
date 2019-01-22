'use strict';

class CommentTokenMailer {
  constructor({ mailTransport, mailOptions, externalURL }) {
    this._mailTransport = mailTransport;
    this._mailOptions = mailOptions;
    this._externalURL = externalURL;
  }

  _getMailOptions(comment, token) {
    const subjectURL = new URL(comment.subject);
    const validationURL = new URL(`ui/verify.html?commentID=${encodeURIComponent(comment.entityID)}&subject=${encodeURIComponent(comment.subject)}&token=${encodeURIComponent(token)}`, this._externalURL);
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

Posted on ${(new Date(comment.date)).toISOString()} as ${comment.author}
${quotedComment}

---
Sincerely yours,
  Comment Bot
`.trim()
    });
  }

  async sendToken(comment, token) {
    const mailOptions = this._getMailOptions(comment, token);
    return await this._mailTransport.sendMail(mailOptions);
  }
}

module.exports = CommentTokenMailer;
