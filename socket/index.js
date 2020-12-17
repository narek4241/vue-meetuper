module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Connection has been established');

    socket.on('meetup/sendPost', (post) => {
      io.emit('meetup/publishPost', post);
    });
  });
};
