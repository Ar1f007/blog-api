require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const middleware = require('./middlewares');
const { logger, connect } = require('./utils');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// users route
app.use('/api/users', require('./routes/user'));

// email route
app.use('/api/email', require('./routes/email'));

// handles route request which does not exist
app.use(middleware.notFound);

// catches error
app.use(middleware.errorHandler);

app.listen(PORT, async () => {
  logger.info(`Server is running at port ${PORT}`);
  await connect();
});
