const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetched sucessfully",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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
  //if re.file is empty w/c means we missed a file(in this case image file)
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  // Create post in DB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    //use the attached userId
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      //found the currently logged in user
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      //The above  line push the post id only(since the type is defined as Schema.Types.ObjectId)
      // to the user posts array
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created sucessfully",
        post: post,
        creator: { _id: creator._id, name: creator.name },
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No such post");
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({
        message: "Successfully fetched",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  // If imageUrl did not set until now
  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }
  //Update in DB
  Post.findById(postId)
    .then((post) => {
      //if the post is not there
      if (!post) {
        const error = new Error("No such post");
        error.statusCode = 422;
        throw error;
      }
      //if the image changed, unlike the first image
      if (imageUrl !== post.imageUrl) {
        cleareImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No such post");
        error.statusCode = 422;
        throw error;
      }
      // Checked logged in user
      cleareImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "Successfully deleted",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const cleareImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
