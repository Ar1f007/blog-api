const { sendEmail } = require('./send-email');

const sendAccountVerifyMail = async (token, user) => {
  const link = `<a href="http://localhost:3000/verify-account/${token}">Verify</a>`;

  const verifyUrl = `
    <strong>Hi ${user.firstName}<strong/>, Welcome to Oh My Blog family!<br/><br/>
    
    Please verify your account by clicking on this link ${link}, so you can make yourself eligible to post content soon. Verify now within 10minutes, otherwise ignore this message.`;

  const msg = {
    to: user.email,
    from: 'blanknoize8@gmail.com',
    subject: 'Verify your account',
    html: verifyUrl,
  };

  await sendEmail(msg);
};

module.exports = sendAccountVerifyMail;