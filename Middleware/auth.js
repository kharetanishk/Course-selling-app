require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

authMiddleware = (req, res, next) => {
  const token = req.header.token;
  //IF THE TOKEN HAVENT PROVIDED
  if (!token) {
    return res.status(400).json({
      error: "Invalid authentication , Please Sign up again",
    });
  }
  try {
    //IF TOKEN PROVIDED DO THE FOLLOWING
    //DECODE IT
    //STORE THE ID OF THE USER SO THAT IT CAN BE PASSED FURTHER
    const decodedToken = jwt.verify(token, secret);
    if (decodedToken) {
      req.userId = decodedToken.id; //storing the id of the user who is logging in in the userId
      next();
    } else {
      return res.status(400).json({
        error: "Invalid authentication , Please Sign up again",
      });
    }
  } catch (error) {
    console.log(
      error + "" + "some error while verifying token -authMiddleware.js"
    );
  }
};
module.exports = {
  authMiddleware,
};
