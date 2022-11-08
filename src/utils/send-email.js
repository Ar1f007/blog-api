const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (msg) => {
  try {
    await sgMail.send(msg);
  } catch (error) {
    // do something with error
  }
};