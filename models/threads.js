const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./posts');

const threadSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: [512, 'Too long, max is 512 characters'],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  meetup: { type: Schema.Types.ObjectId, ref: 'Meetup' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

threadSchema.post('remove', removePosts);

async function removePosts(doc, next) {
  try {
    // #note tutor syntax opt rm
    await Post.remove({ _id: { $in: doc.posts } });
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = mongoose.model('Thread', threadSchema);
