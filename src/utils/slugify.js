const slugify = require('slugify');

const slugifyIt = (str) =>
  slugify(str, {
    lower: true,
    trim: true,
    remove: /[^A-Z0-9*+~.()'"!:@]+/gi,
  });

module.exports = slugifyIt;