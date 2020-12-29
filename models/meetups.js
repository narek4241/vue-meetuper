const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');
const Thread = require('./threads');

const meetupSchema = new Schema({
  location: { type: String, required: true },
  processedLocation: String,
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  shortInfo: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  startDate: { type: Date, required: true },
  timeFrom: { type: String, required: true },
  timeTo: { type: String, required: true },
  status: String,
  joinedPeopleCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // #note "{type: Schema..., ref...}" syntax below referencing to other schemas (User) opt
  meetupCreator: { type: Schema.Types.ObjectId, ref: 'User' },
  joinedPeople: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

meetupSchema.post('remove', removeThreads);

async function removeThreads(meetup, next) {
  try {
    // #note telling step by step -> executing opt rm
    await Thread.find({ meetup: { $in: meetup._id } }, (errors, threads) => {
      if (errors) {
        return next(errors);
      }
      // #task #findOut PromiseAll usage here
      return Promise.all(threads.map((t) => t.remove()));
    });

    // #note telling step by step -> executing opt rm
    await User.updateMany(
      { _id: { $in: meetup.joinedPeople } },
      { $pull: { joinedMeetups: meetup._id } }
    );
    // #task #res2 usage
    next();
  } catch (e) {
    // #task #res usage
    next(e);
  }
}

module.exports = mongoose.model('Meetup', meetupSchema);
