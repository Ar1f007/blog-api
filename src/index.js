const express = require('express');
require('dotenv').config();

const middleware = require('./middlewares');
const { logger, connect } = require('./utils');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// users route
app.use('/api/users', require('./routes/user'));

// handles route request which does not exist
app.use(middleware.notFound);

// catches error
app.use(middleware.errorHandler);

app.listen(PORT, async () => {
  logger.info(`Server is running at port ${PORT}`);
  await connect();
});
