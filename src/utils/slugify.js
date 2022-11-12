const slugify = require('slugify');

const slugifyIt = (str) =>
  slugify(str, {
    lower: true,
  });

module.exports = slugifyIt;