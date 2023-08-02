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
  const title = req.body.title;
  const content = req.body.content;
  // Create post in DB
  res.status(201).json({
    message: "Post created sucessfully",
    post: [
      {
        _id: new Date().toISOString(),
        title: title,
        content: content,
        creator: { name: "Faysel" },
        createdAt: new Date(),
      },
    ],
  });
};
