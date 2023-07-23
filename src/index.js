const os = require('os');

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

process.env.UV_THREADPOOL_SIZE = os.cpus().length;

const middleware = require('./middleware');
const { logger, connect } = require('./utils');

const reactionRoute = require('./routes/reaction');
const bookmarkRoute = require('./routes/bookmark');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(cookieParser());

// users route
app.use('/api/users', require('./routes/user'));

// post route
app.use('/api/posts', require('./routes/post'));

// category route
app.use('/api/categories', require('./routes/category'));

// tag routes
app.use('/api/tags', require('./routes/tag'));

// comment route
app.use('/api/comments', require('./routes/comment'));

// reactions route
app.use('/api/reactions', reactionRoute);

// bookmark route
app.use('/api/bookmarks', bookmarkRoute);

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
