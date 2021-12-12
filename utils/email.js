const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");
const AppError = require("./error");
class Email {
  constructor(recipient, subject, text_message) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gpaelevator01@gmail.com",
        pass: "zkshgzbaumskjbyf",
      },
    });
    this.firstName = recipient.first_name;
    this.from = "admin@gpaelevator.com";
    this.to = recipient.email;
    this.subject = subject;
    this.text = text_message;
  }
  async send(html, subject) {
    //render html based on pug template

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
    const html = pug.renderFile(`${__dirname}/../views/email/welcome.pug`, {
      firstName: this.firstName,
      subject: this.subject,
    });
    await this.send(html, "Welcome to Gpa Elevator");
  }
  async sendPasswordReset(url) {
    const html = pug.renderFile(
      `${__dirname}/../views/email/passwordReset.pug`,
      {
        firstName: this.firstName,
        subject: this.subject,
        url,
      }
    );
    await this.send(html, "Reset Password");
  }
  async sendNotification(object, objName) {
    const html = pug.renderFile(
      `${__dirname}/../views/email/notification.pug`,
      {
        object,
        objName,
      }
    );
    await this.send(html, "Notification");
  }
  async sendVerifyAccount(url) {
    const html = pug.renderFile(
      `${__dirname}/../views/email/verifyAccount.pug`,
      {
        firstName: this.firstName,
        subject: this.subject,    
        url,
      }
    );
    await this.send(html, "Verify Account");
  }
  async sendFileUploadNotification(
    courseUnit,
    academic_year,
    custom_name,
    downloadURL
  ) {
    const html = pug.renderFile(`${__dirname}/../views/email/info.pug`, {
      firstName: this.firstName,
      courseUnit: courseUnit.replaceAll("-", " "),
      academic_year: academic_year,
      custom_name: custom_name,
      downloadURL,
    });

    await this.send(html, "New Document Uploaded");
  }
}

module.exports = Email;
