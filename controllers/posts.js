const Post = require('../models/posts');
const Thread = require('../models/threads');

exports.getPosts = function (req, res) {
  const threadId = req.query.threadId;

  Post.find({ thread: threadId })
    .populate('user')
    .exec((errors, posts) => {
      if (errors) {
        return res.status(422).send({ errors });
      }

      return res.json(posts);
    });
};

exports.sendPost = (req, res) => {
  const postData = req.body;
  const post = new Post(postData);
  post.user = req.user;

  post.save((errors, createdPost) => {
    if (errors) {
      res.status(422).send({ errors });
    }

    Thread.update(
      { _id: createdPost.thread },
      // #note1 we can also push an ID i.o createdPost itself (my*) opt
      { $push: { posts: createdPost } },
      () => {
        res.send({ createdPost });
      }
    );
  });
};
