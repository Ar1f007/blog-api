const express = require('express');
const { logger, connect } = require('./utils');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  logger.info(`Server is running at port ${PORT}`);
  await connect();
});
