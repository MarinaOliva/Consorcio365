const nodemailer = require('nodemailer');
const dns = require('dns').promises;

let cachedIPv4 = null;
let cacheTime = 0;
const CACHE_MS = 60 * 60 * 1000; // 1 hora

async function getGmailIPv4() {
  const now = Date.now();
  if (cachedIPv4 && (now - cacheTime) < CACHE_MS) {
	return cachedIPv4;
  }
  const { address } = await dns.lookup('smtp.gmail.com', { family: 4 });
  cachedIPv4 = address;
  cacheTime = now;
  console.log('IPv4 resuelta para smtp.gmail.com:', address);
  return address;
}

const sendMail = async (to, subject, html) => {
  const ipv4 = await getGmailIPv4();

  const transporter = nodemailer.createTransport({
	host: ipv4,              	
	port: 587,
	secure: false,
	auth: {
  	user: process.env.MAIL_USER,
  	pass: process.env.MAIL_PASS
	},
	tls: {
  	servername: 'smtp.gmail.com',   
  	rejectUnauthorized: false
	}
  });

  await transporter.sendMail({
	from: `"Consorcio365" <${process.env.MAIL_USER}>`,
	to,
	subject,
	html
  });
};

module.exports = sendMail;

