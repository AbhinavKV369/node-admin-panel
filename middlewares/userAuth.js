const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authenticateUser(req, res, next) {
const token = req.cookies.token;

  if (!token) {
    console.log("Unauthorized User");
    return res.redirect("/login");
  }
  try {
    const verifyUser = jwt.verify(token, process.env.secret_key);
    req.user = verifyUser.user;
    next();
  } catch (error) {
    console.log("Error in Authentication:", error);
    return res.redirect("/login");
  }
}

module.exports = authenticateUser;

