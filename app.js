const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();

const feedRoutes = require("./routes/feed");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
    //null = no error
  } else {
    cb(null, false);
  }
};

//app.use(bodyParser.urlencoded());
//This is for data that are in the
//form of x-www-form-urlencoded(for example data that come from <form></form>)

//For parsing json data(application/json) from incoming req we use the following
app.use(bodyParser.json());
//For any file request start with '/images' go to the images folder
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

app.use((req, res, next) => {
  //set header to all response, NOTE that setHeader() does not send response
  //like res.render() and res.json(), it just only modified and add new header
  res.setHeader("Access-Control-Allow-Origin", "*");
  // '*' means for do this for domains, you can do this for a specific domain

  //set which methods do you want to allow to be sended to your server
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, PATCH, DELETE");
  //set which header do you want to allow to be sended your server
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

//register a general error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500; // if statusCode is undefined 500 will be
  //All error obj has message field by defualt. (or what you pass in constructor of Error("message"))
  const message = error.message;
  res.status(status).json({
    message: message,
  });
});

mongoose
  .connect(
    "mongodb+srv://new-faysel:0966463034f@cluster0.ogdb2gk.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
