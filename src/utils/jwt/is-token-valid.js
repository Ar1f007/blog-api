const jwt = require('jsonwebtoken');
/**
 *
 * @param {string} token
 * @returns jwt data - { userId, iat, expiresIn }
 */
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);

module.exports = isTokenValid;