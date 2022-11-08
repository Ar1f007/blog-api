const sgMail = require('@sendgrid/mail');
const { StatusCodes } = require('http-status-codes');

const Email = require('../../models/email');
const { asyncWrapper, AppError } = require('../../utils');

const sendEmail = asyncWrapper(async (req, res) => {
  const { from, to, subject, message } = req.body;

  const msg = {
    to,
    from,
    subject,
    text: message,
  };

  const resp = await sgMail.send(msg);

  if (!resp) {
    throw new AppError(
      'Something went wrong. Could not send mail',
      StatusCodes.EXPECTATION_FAILED
    );
  }

  await Email.create({
    sentBy: req.user.userId,
    from: req.user.email,
    to,
    subject,
    message,
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'Email sent successfully!' });
});

module.exports = sendEmail;