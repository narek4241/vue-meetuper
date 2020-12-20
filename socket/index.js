module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Connection has been established');

    socket.on('meetup/subscribe', (meetupId) => {
      console.log('joining', `meetup-${meetupId}`);
      socket.join(`meetup-${meetupId}`);
    });

    socket.on('meetup/unsubscribe', (meetupId) => {
      console.log('leaving', `meetup-${meetupId}`);
      socket.leave(`meetup-${meetupId}`);
    });

    socket.on('meetup/postSaved', (post) => {
      console.log('emitting meetup', `meetup-${post.meetup}`);
      socket.to(`meetup-${post.meetup}`).emit('meetup/postPublished', post);
    });
  });
};
