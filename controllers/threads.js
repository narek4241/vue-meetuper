const Thread = require('../models/threads');

exports.getThreads = (req, res) => {
  const { meetupId } = req.query;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const pageNumber = parseInt(req.query.pageNumber) || 1;

  const skips = pageSize * (pageNumber - 1);

  Thread.find({})
    .where({ meetup: meetupId })
    .skip(skips)
    .limit(pageSize + 1)
    .sort({ createdAt: -1 })
    .populate({
      path: 'posts',
      options: { limit: 5, sort: { createdAt: -1 } },
      populate: { path: 'user' },
    })
    .exec((errors, threads) => {
      if (errors) {
        return res.status(422).send(errors);
      }

      let isAllDataLoaded = false;
      // #note initially was set to static 5, now changed (my) opt
      if (threads.length <= pageSize) {
        isAllDataLoaded = true;
      }
      return res.send({
        threads: threads.splice(0, pageSize),
        isAllDataLoaded,
      });
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
