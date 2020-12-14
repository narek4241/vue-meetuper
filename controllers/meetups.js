const { json } = require('body-parser');
const Meetup = require('../models/meetups');
const User = require('../models/users');

exports.getMeetups = function (req, res) {
  Meetup.find({})
    .populate('category')
    .populate('joinedPeople')
    .exec((errors, meetups) => {
      if (errors) {
        return res.status(422).send({ errors });
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

// #note #v1 join meetup first implementation (working) fully opt
// exports.joinMeetup = async (req, res) => {
//   const { user } = req;
//   const { id } = req.params;

//   const meetup = await Meetup.findById(id);

//   meetup.joinedPeople = [...meetup.joinedPeople, user];
//   meetup.joinedPeopleCount++;

//   meetup.save((err, meetup) => {
//     if (err) {
//       res.status().json({ errors: err });
//     }

//     res.send(meetup);
//   });
// };

exports.joinMeetup = (req, res) => {
  const { user } = req;
  const { id } = req.params;

  // #task #findOut how this works without adding async/await to this below
  Meetup.findById(id, (errors, meetup) => {
    if (errors) {
      // #note {errors} <=> {errors: errors} chsm2 opt
      res.status(422).send({ errors });
    }

    meetup.joinedPeople.push(user);
    meetup.joinedPeopleCount++;

    Promise.all([
      meetup.save(),
      User.updateOne({ _id: user._id }, { $push: { joinedMeetups: id } }),
    ])
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
      res.send({ id });
    })
    .catch((errors) => res.status(422).json({ errors }));
};
