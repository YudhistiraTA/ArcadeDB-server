const nodemailer = require("nodemailer");

function registerSuccess(email) {
  let transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "kobonagara@gmail.com",
      pass: "czwzkvtwwbftzgjo",
    },
  });
  let info = transporter.sendMail({
    from: "jejeshuang307@gmail.com",
    to: email,
    subject: "Register Success!",
    text: `Hello ${email}, welcome to My ArcadeDb, please enjoy`,
  });
}

module.exports = { registerSuccess };
