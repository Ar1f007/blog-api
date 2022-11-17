const slugify = require('slugify');

const slugifyIt = (str) =>
  slugify(str, {
    trim: true,
    lower: true,
  });

module.exports = slugifyIt;