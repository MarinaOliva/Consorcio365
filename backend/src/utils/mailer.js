const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, html) => {
  const { data, error } = await resend.emails.send({
    from: 'Consorcio365 <onboarding@resend.dev>', // o tu dominio verificado
    to,
    subject,
    html
  });

  if (error) {
    console.error('Error enviando mail:', error);
    throw error;
  }

  return data;
};

module.exports = sendMail;