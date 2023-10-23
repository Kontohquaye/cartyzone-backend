const jwt = require("jsonwebtoken");

const generateToken = (value) => {
  const token = jwt.sign({ value }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

module.exports = generateToken;
