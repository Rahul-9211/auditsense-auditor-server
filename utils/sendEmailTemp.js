const nodemailer = require("nodemailer");

const sendEmail = (options) => {
    console.log("before config ")
  var config = {
    host: process.env.EMAIL_SERVICE,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  };
  var transporter = nodemailer.createTransport(config);
//   console.log(EMAIL_SERVICE,EMAIL_USERNAME,EMAIL_PASSWORD)
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };
  console.log(options.to, options.subject , options.text)

  transporter.verify((err, success) => {
    if (err) console.error(err);
    console.log("Your config is correct");
  });
  
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("inside sendemail", err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
