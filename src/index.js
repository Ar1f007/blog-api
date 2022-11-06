const express = require('express');
require('dotenv').config();

const { logger, connect } = require('./utils');

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  logger.info(`Server is running at port ${PORT}`);
  await connect();
});
