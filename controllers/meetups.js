const Meetup = require('../models/meetups');
const User = require('../models/users');

exports.getMeetups = (req, res) => {
  const { category, location } = req.query;

  const findQuery = location
    ? // #note '.*' every character 0 || 0+ times
      Meetup.find({ processedLocation: { $regex: '.*' + location + '.*' } })
    : Meetup.find({});

  findQuery
    .populate('category')
    .populate('joinedPeople')
    .limit(5)
    .sort({ createdAt: -1 })
    .exec((errors, meetups) => {
      if (errors) {
        return res.status(422).send({ errors });
      }
      // #note WARNING: requires improvement, can decrease performance (!my) opt
      if (category) {
        meetups = meetups.filter((meetup) => meetup.category.name === category);
      }
      return res.json(meetups);
    });
};

exports.getMeetupById = function (req, res) {
  const { id } = req.params;

  Meetup.findById(id)
    .populate('meetupCreator', 'name id avatar')
    .populate('category')
    .populate({
      path: 'joinedPeople',
      options: { limit: 5, sort: { username: -1 } },
    })
    .exec((errors, meetup) => {
      if (errors) {
        return res.status(422).send({ errors });
      }

      return res.json(meetup);
    });
};

exports.getSecret = (req, res) => {
  return res.json({ secret: 'I am Secret message' });
};

exports.createMeetup = (req, res) => {
  const meetupData = req.body;

  const meetup = new Meetup(meetupData);
  meetup.status = 'active';

  meetup.save((err, createdMeetup) => {
    if (err) {
      return res.status(422).send({ err });
    }

    res.json(createdMeetup);
  });
};

exports.joinMeetup = (req, res) => {
  const { user } = req;
  const { id } = req.params;

  // #task #findOut how this works without adding async/await to this below
  Meetup.findById(id, (errors, meetup) => {
    if (errors) {
      // #note {errors} <=> {errors: errors} chsm2 opt
      res.status(422).send({ errors });
    }

    if (meetup) {
      meetup.joinedPeople.push(user);
      meetup.joinedPeopleCount++;
    } else {
      res.status(422).send({
        errors: {
          status: 'Meetup is not found',
        },
      });
    }

    Promise.all([
      meetup.save(),
      User.updateOne({ _id: user._id }, { $push: { joinedMeetups: id } }),
    ])
      // #task #findOut2 res from parent function and not from .then()
      .then((result) => res.send({ id }))
      .catch((errors) => res.status(422).send({ errors }));
  });
};

exports.leaveMeetup = (req, res) => {
  const { user } = req;
  const { id } = req.params;

  Promise.all([
    Meetup.updateOne(
      { _id: id },
      {
        // #task #findOut #syntax user._id
        $pull: { joinedPeople: user._id },
        $inc: { joinedPeopleCount: -1 },
      }
    ),
    User.updateOne({ _id: user._id }, { $pull: { joinedMeetups: id } }),
  ])
    .then((result) => {
      // #task #2 #dpl #findOut2 res from parent function and not from .then()
      res.send({ id });
    })
    .catch((errors) => res.status(422).json({ errors }));
};

exports.updateMeetup = (req, res) => {
  const meetup = req.body;
  const { id } = req.params;
  const { user } = req;

  meetup.updateAt = new Date();

  // #note user['_id'] returns 'object',but user['_id'] returns needed 'string' opt
  if (user.id === meetup.meetupCreator._id) {
    Meetup.findByIdAndUpdate(id, { $set: meetup }, { new: true })
      .populate('meetupCreator')
      .populate('category')
      .exec((errors, updatedMeetup) => {
        if (errors) {
          return res.status(422).send(errors);
        }

        return res.json(updatedMeetup);
      });
  } else {
    res.status(401).send({ errors: { message: 'Not Authorized' } });
  }
};

// #note working variant #my opt rm
// exports.deleteMeetup = async (req, res) => {
//   const { id } = req.params;
//   const { user } = req;

//   const meetup = await Meetup.findById(id).populate('meetupCreator');

//   if (user.id === meetup.meetupCreator.id) {
//     Meetup.findByIdAndDelete(id, (errors, deletedMeetup) => {
//       if (errors) {
//         return res.status(422).send(errors);
//       }
//       return res.send(deletedMeetup);
//     });
//   } else {
//     return res.status(401).send({ errors: { message: 'Not Authorized' } });
//   }
// };

exports.deleteMeetup = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  Meetup.findById(id, (errors, meetup) => {
    if (errors) {
      return res.status(422).send(errors);
    }

    if (meetup.meetupCreator != user.id) {
      return res.status(401).send({ errors: { message: 'Not Authorized' } });
    }

    // #note findByIdAndDelete also works
    meetup.remove((errors, _) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      return res.json(meetup);
    });
  });
};
