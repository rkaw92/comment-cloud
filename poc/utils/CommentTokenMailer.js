'use strict';

class CommentTokenMailer {
  constructor({ commentValidator, mailTransport, mailOptions }) {
    this._commentValidator = commentValidator;
    this._mailTransport = mailTransport;
    this._mailOptions = mailOptions;
  }

  async sendToken(comment) {
    const token = await this._commentValidator.getToken(comment);
    const mailOptions = Object.assign({}, this._mailOptions, {
      to: comment.author,
      subject: 'Confirm your comment on <TODO>',
      text: `Comment ID: ${comment.getEntityID()}\nToken: ${token}\nPlease validate via POST.`
    });
    return this._mailTransport.sendMail(mailOptions);
  }
}

module.exports = CommentTokenMailer;
