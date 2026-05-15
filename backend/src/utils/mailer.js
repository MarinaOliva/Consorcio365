const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS   // contraseña de aplicación de Google, no la del mail
  }
});

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Consorcio365" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = sendMail;
