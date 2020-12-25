const Thread = require('../models/threads');

exports.getThreads = (req, res) => {
  const { meetupId } = req.query;
  const pageSize = req.query.pageSize || 5;
  const pageNumber = req.query.pageNumber || 1;

  const skips = pageSize * (pageNumber - 1);

  Thread.find({})
    .where({ meetup: meetupId })
    .skip(parseInt(skips))
    .limit(pageSize + 1)
    .populate({
      path: 'posts',
      options: { limit: 5, sort: { createdAt: -1 } },
      populate: { path: 'user' },
    })
    .exec((errors, threads) => {
      if (errors) {
        res.status(422).send(errors);
      }

      let isAllDataLoaded = false;
      if (threads.length <= 5) {
        isAllDataLoaded = true;
      }
      res.send({ threads: threads.splice(0, 5), isAllDataLoaded });
    });
};

exports.postThread = (req, res) => {
  const threadData = req.body;
  const thread = new Thread(threadData);
  thread.user = req.user;

  thread.save((errors, newThread) => {
    if (errors) {
      res.status(422).send({ errors });
    }

    res.send(newThread);
  });
};
