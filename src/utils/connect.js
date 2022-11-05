const mongoose = require('mongoose');
const logger = require('./logger');

async function connect() {
  const dbUri = process.env.DB_URI;

  try {
    await mongoose.connect(dbUri);
    logger.info('DB connected');
  } catch (error) {
    logger.fatal('Could not connect to DB');
    process.exit(1);
  }
}

module.exports = connect;
