const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const confirmationHashSchema = new Schema({
  expireAt: {
    type: Date,
    default: Date.now,
    // #task #res2 syntax (not usage)
    index: {
      expires: '1d',
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('ConfirmationHash', confirmationHashSchema);
