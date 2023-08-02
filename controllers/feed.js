const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First day",
        content: "This is my first day with REST API",
        imageUrl: "images/test.png",
        creator: { name: "Faysel" },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/test.png",
    creator: { name: "Faysel" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created sucessfully",
        post: result,
      });
    })
    .catch((err) => console.log(err));
};
