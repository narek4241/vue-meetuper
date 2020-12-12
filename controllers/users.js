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
