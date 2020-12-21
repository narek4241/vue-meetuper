const passport = require('passport');
const User = require('../models/users');
const Meetup = require('../models/meetups');
const Thread = require('../models/threads');
const Post = require('../models/posts');
const Category = require('../models/categories');

exports.getUsers = function (req, res) {
  User.find({}).exec((errors, users) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    return res.json(users);
  });
};

exports.getCurrentUser = function (req, res, next) {
  // #task #findOut from where 'req.user' comes from
  const user = req.user;

  if (!user) {
    return res.sendStatus(422);
  }

  // #note Only for "Session" Authentication
  // return res.json(user);
  return res.json(user.toAuthJSON());
};

exports.register = async (req, res) => {
  const registerData = req.body;
  if (!registerData.email) {
    return res.status(422).json({
      errors: {
        message: 'Email is required',
      },
    });
  }

  if (!registerData.password) {
    return res.status(422).json({
      errors: {
        message: 'Password is required',
      },
    });
  }

  try {
    const currentUser = await User.findOne({ email: registerData.email });
    if (currentUser) {
      res.status(400).send('This email already exists');
    }

    const user = new User(registerData);
    const data = await user.save();

    // #note password hashing could be also here rm
    res.send(data);
  } catch (error) {
    console.log(error);
    // res.status(400).send('Something went wrong');
    res.status(400).send(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({
      errors: {
        message: 'Email is required',
      },
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        message: 'Password is required',
      },
    });
  }

  return passport.authenticate('local', (err, passportUser) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      // #note Only for "Session" Authentication
      // req.login(passportUser, (err) => {
      //   if (err) {
      //     next(err);
      //   }
      //   return res.json(passportUser);
      // });

      return res.json(passportUser.toAuthJSON());
    } else {
      return res.status(422).send({
        errors: {
          message: 'Invalid Email or Password',
        },
      });
    }
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  return res.json({ status: 'Session destroyed' });
};

function fetchMeetupsByUserQuery(userId) {
  return Meetup.aggregate([
    {
      $facet: {
        meetups: [
          { $match: { meetupCreator: userId } },
          { $limit: 5 },
          { $sort: { createdAt: -1 } },
        ],
        meetupsCount: [
          { $match: { meetupCreator: userId } },
          { $count: 'count' },
        ],
      },
    },
  ])
    .exec()
    .then(
      (results) =>
        new Promise((resolve) => {
          Category.populate(results[0].meetups, { path: 'category' }).then(
            (populatedMeetups) => {
              if (populatedMeetups && populatedMeetups.length > 0) {
                // #note "(0 || 1)" -> meetupsCount"[0]" is syntax (to access count) opt1
                resolve({
                  data: populatedMeetups,
                  count: results[0].meetupsCount[0].count,
                });
              } else {
                resolve({ data: results[0].meetups, count: 0 });
              }
            }
          );
        })
    );
}

function fetchThreadsByUserQuery(userId) {
  return Thread.aggregate([
    {
      $facet: {
        threads: [
          { $match: { user: userId } },
          { $limit: 5 },
          { $sort: { createdAt: -1 } },
        ],
        threadsCount: [{ $match: { user: userId } }, { $count: 'count' }],
      },
    },
  ])
    .exec()
    .then((results) => {
      const { threads } = results[0];
      if (threads && threads.length > 0) {
        return { data: threads, count: results[0].threadsCount[0].count };
      }
      return { data: threads, count: 0 };
    });
}

function fetchPostsByUserQuery(userId) {
  return Post.aggregate([
    {
      $facet: {
        posts: [
          { $match: { user: userId } },
          { $limit: 5 },
          { $sort: { createdAt: -1 } },
        ],
        postsCount: [{ $match: { user: userId } }, { $count: 'count' }],
      },
    },
  ])
    .exec()
    .then((results) => {
      const { posts } = results[0];
      if (posts && posts.length > 0) {
        return { data: posts, count: results[0].postsCount[0].count };
      }
      return { data: posts, count: 0 };
    });
}

exports.getUserActivity = (req, res) => {
  const userId = req.user._id;

  Promise.all([
    fetchMeetupsByUserQuery(userId),
    fetchThreadsByUserQuery(userId),
    fetchPostsByUserQuery(userId),
  ])
    .then(([meetups, threads, posts]) => res.json({ meetups, threads, posts }))
    .catch((err) => res.status(422).send(err));
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const user = { req };
  const userData = req.body;

  if (user._id === userId) {
    User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true },
      (errors, updatedUser) => {
        if (errors) {
          res.status(422).send({ errors });
        }
        return res.json(updatedUser);
      }
    )
      .then(() => {
        console.log('success');
      })
      .catch((err) => res.status(422).send({ err }));
  } else {
    res.status(401).send({ errors: 'Authorization Error' });
  }
};
