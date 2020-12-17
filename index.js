const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MONGO_URI, PORT, NODE_ENV, SESSION_SECRET } = require('./config');

const session = require('express-session');
const passport = require('passport');

// #note Only for "Session" Authentication
// const MongoDBStore = require('connect-mongodb-session')(session);
// const store = new MongoDBStore({
//   uri: MONGO_URI,
//   collection: 'meetuperSessions',
// });

// store.on('error', (error) => {
//   console.log(error);
// });

require('./models/meetups');
require('./models/users');
require('./models/threads');
require('./models/posts');
require('./models/categories');

require('./services/passport');

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
const server = require('http').createServer(app);
const io = require('socket.io')(server, { pingTimeout: 60000 });

require('./socket')(io);

app.use(bodyParser.json());
app.use(cors());

// #note Only for "Session" Authentication
// app.use(
//   session({
//     secret: SESSION_SECRET,
//     cookie: { maxAge: 3600000 },
//     resave: false,
//     saveUninitialized: false,
//     store,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

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

server.listen(PORT, function () {
  console.log(`App is running on port: ${PORT}`);
});
