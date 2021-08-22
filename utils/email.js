const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");

class Email {
  constructor(recipient, subject, text_message, url) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gpaelevator01@gmail.com",
        pass: "zkshgzbaumskjbyf",
      },
    });
    this.firstName = recipient.first_name;
    this.from = "admin@gpa-elevator.com";
    this.to = recipient.email;
    this.subject = subject;
    this.text = text_message;
    this.url = url;
  }
  async send(template, subject) {
    //render html based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(html),
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      console.log("error sending email", err);
      new AppError("failed to send email", 403);
    }
  }
  async sendEmail() {
    try {
      this.transporter.sendMail(this.mailOptions);
    } catch (err) {
      console.log("error sending email", err);
      new AppError("failed to send email", 403);
    }
  }
  async sendWelcome() {
    console.log("reached jere");
    await this.send("welcome", "Welcome to GPA-elevator");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "your password reset token valid for 20 minutes"
    );
  }
}

module.exports = Email;
