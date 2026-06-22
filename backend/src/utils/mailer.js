const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,    	
  family: 4,        	
  auth: {
	user: process.env.MAIL_USER,
	pass: process.env.MAIL_PASS   
  },
  tls: {
	rejectUnauthorized: false
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

