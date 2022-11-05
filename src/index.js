const express = require('express');
const connect = require('./utils/connect');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
console.log(process.env.DB_URI);
app.listen(PORT, async () => {
  console.log('server is running');
  await connect();
});
