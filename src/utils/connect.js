const mongoose = require('mongoose');

async function connect() {
  const dbUri = process.env.DB_URI;

  try {
    await mongoose.connect(dbUri);
    console.log('DB connected');
  } catch (error) {
    console.error('Could not connect to DB');
    process.exit(1);
  }
}

module.exports = connect;
