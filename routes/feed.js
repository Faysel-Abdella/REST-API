const express = require("express");
const { body, check } = require("express-validator");

const router = express.Router();

const feedController = require("../controllers/feed");

router.get("/posts", feedController.getPosts);

router.post(
  "/post",
  [
    body("title").trim().isAlphanumeric().isLength({ min: 5 }),
    body("content").trim().isAlphanumeric().isLength({ min: 5 }),
  ],
  feedController.createPost
);

module.exports = router;
