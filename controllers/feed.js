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
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
    //The above line throws the error object, which will be caught by any
    //error handling middleware that has been set up in the application.(in app.js)
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
    .catch((err) => {
      //If the incoming error do not conatins statusCode field
      //add this field to the incomming error obj (500, since this
      //is server side error) and transfer(throw) this error to
      //error handling middleware that has been set up in the application.(in app.js)
      //since this block async we do not say throw err. We say next(err)
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
