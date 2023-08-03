const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  //configuartion: If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
  //1-createdAt: a date representing when this document was created
  //2-updatedAt: a date representing when this document was last updated
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
