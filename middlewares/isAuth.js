const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  // const token = req.cookies.cartyzone;
  const authorization = req.headers.authorization;
  // console.log(token);
  // if (token) {
  //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //     if (err) {
  //       res.send.status(409).send({ error: "Invalid user credentials" });
  //     } else if (decoded) {
  //       req.user = decoded;
  //       next();
  //     }
  //   });
  // } else {
  //   console.log("failed");
  //   res.send.status(401).send({ error: "Unauthorized access" });
  // }
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error) {
        res.status(401).send({ message: "invalid token" });
      } else {
        req.user = decode;

        next();
      }
    });
  } else {
    res.status(401).send({ message: "Not authorized" });
  }
};

module.exports = { isAuth };
