const createToken = require('./create-jwt-token');

const threeDays = 1000 * 60 * 60 * 24 * 3;

/**
 * Attaches jwt token to cookies
 * @param {Response} res Express response
 * @param {String} jwtToken jwt token
 */
const attachCookiesToResponse = (res, user) => {
  const { firstName, lastName, email, id, role, username, photo, bio } = user;

  const token = createToken({
    fullName: firstName + ' ' + lastName,
    email,
    userId: id,
    role,
    username,
    photo,
    bio: bio ?? '',
  });

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + threeDays),
    secure: process.env.NODE_ENV === 'production',
  });
};

module.exports = attachCookiesToResponse;