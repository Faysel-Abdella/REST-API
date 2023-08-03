const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  emal: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new",
  },
  posts: [
    {
      type: Schema.Types.ObjectId, //reference id to the post
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
