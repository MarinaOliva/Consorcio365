const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendMail = async (to, subject, html) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
	name: 'Consorcio365',
	email: process.env.MAIL_SENDER, 
  };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;

  try {
	const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
	return result;
  } catch (err) {
	console.error('Error enviando mail:', err.response?.body || err.message);
	throw err;
  }
};

module.exports = sendMail;