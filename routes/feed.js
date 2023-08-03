const express = require("express");
const { body, check } = require("express-validator");

const router = express.Router();

const feedController = require("../controllers/feed");

router.get("/posts", feedController.getPosts);

router.get("/post/:postId", feedController.getPost);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

module.exports = router;
