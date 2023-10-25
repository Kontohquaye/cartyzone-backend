const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.cookies.cartyzone;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.send.status(409).send({ error: "Invalid user credentials" });
      } else if (decoded) {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.send.status(401).send({ error: "Unauthorized access" });
  }
};

module.exports = { isAuth };
