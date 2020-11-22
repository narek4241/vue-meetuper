const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MONGO_URI, PORT, NODE_ENV } = require('./config');

require('./models/meetups');
require('./models/users');
require('./models/threads');
require('./models/posts');
require('./models/categories');

const meetupsRoutes = require('./routes/meetups'),
  usersRoutes = require('./routes/users'),
  threadsRoutes = require('./routes/threads'),
  postsRoutes = require('./routes/posts'),
  categoriesRoutes = require('./routes/categories');

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(err));

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/meetups', meetupsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/threads', threadsRoutes);
app.use('/api/v1/categories', categoriesRoutes);

if (NODE_ENV === 'development') {
  app.get('/', (req, res) => res.status(200).send('Hello world'));
} else if (NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, function () {
  console.log('App is running on port: ' + PORT);
});
