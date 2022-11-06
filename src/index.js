const express = require('express');
const middleware = require('./middlewares');

require('dotenv').config();

const { logger, connect } = require('./utils');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(middleware.notFound);
app.use(middleware.errorHandler);

app.listen(PORT, async () => {
  logger.info(`Server is running at port ${PORT}`);
  await connect();
});
