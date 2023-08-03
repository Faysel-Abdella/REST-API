const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // get some hader value using 'get(headerName)'
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authentucared");
    error.statusCode = 401;
    throw error;
  }
  //attatching the userId to the req
  req.userId = decodedToken.userId;
  next();
};
