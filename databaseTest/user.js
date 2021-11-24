const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  queue: {
    type: Array,
    required: false
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;