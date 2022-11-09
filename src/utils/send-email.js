const { send } = require('./send');

const sendEmail = async (token, user, verify = true) => {
  const link = `<a href="http://localhost:3000/verify-account/${token}">Verify</a>`;

  let message;

  if (verify) {
    message = `<strong>Hi ${user.firstName}<strong/>, Welcome to Oh My Blog family!<br/><br/>    
    Please verify your account by clicking on this link ${link}, so you can make yourself eligible to post content soon. Verify now within 10minutes, otherwise ignore this message.`;
  }

  message = `Your password reset code: <strong>${token}<strong/>. Verify within 10 minutes`;

  const msg = {
    to: user.email,
    from: 'blanknoize8@gmail.com',
    subject: 'Verify your account',
    html: message,
  };

  await send(msg);
};

module.exports = sendEmail;