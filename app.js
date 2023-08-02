const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const feedRoutes = require("./routes/feed");

//app.use(bodyParser.urlencoded());
//This is for data that are in the
//form of x-www-form-urlencoded(for example data that come from <form></form>)

//For parsing json data(application/json) from incoming req we use the following
app.use(bodyParser.json());

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

mongoose
  .connect(
    "mongodb+srv://new-faysel:0966463034f@cluster0.ogdb2gk.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
