const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.cookies && req.cookies.authToken || false;
  if (!token) {
    return res.status(403).send("Please login!");
  }

  jwt.verify(token, process.env.AUTH_SECRET, (err, result) => {
    if (err) {
      return res.status(403).send("Please login");
    }
    next();
  });
}