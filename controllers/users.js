const passport = require('passport');
const User = require('../models/users');

exports.getUsers = function (req, res) {
  User.find({}).exec((errors, users) => {
    if (errors) {
      return res.status(422).send({ errors });
    }

    return res.json(users);
  });
};

exports.register = async (req, res) => {
  try {
    const currentUser = await User.findOne({ email: req.body.email });
    if (currentUser) {
      res.status(400).send('This email already exists');
    }

    const user = new User(req.body);
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
    res.status(422).send('email is required');
  }
  if (!password) {
    res.status(422).send('password is required');
  }

  // const currentUser

  return passport.authenticate('local', (err, passportUser) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      req.login(passportUser, (err) => {
        if (err) {
          next(err);
        }
        return res.json(passportUser);
      });
    } else {
      return res.status(422).send({
        errors: {
          authentication: 'Oops smth went wrong',
        },
      });
    }
  })(req, res, next);
};
