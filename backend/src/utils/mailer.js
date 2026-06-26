const axios = require('axios');

const sendMail = async (to, subject, html) => {
  try {
	const response = await axios.post(
  	'https://api.brevo.com/v3/smtp/email',
  	{
    	sender: {
      	name: 'Consorcio365',
      	email: process.env.MAIL_SENDER,
    	},
    	to: [{ email: to }],
    	subject,
    	htmlContent: html,
  	},
  	{
    	headers: {
      	'api-key': process.env.BREVO_API_KEY,
      	'Content-Type': 'application/json',
      	'Accept': 'application/json',
    	},
  	}
	);
	return response.data;
  } catch (err) {
	console.error('Error enviando mail:', err.response?.data || err.message);
	throw err;
  }
};

module.exports = sendMail;