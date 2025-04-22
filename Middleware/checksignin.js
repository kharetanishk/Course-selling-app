const bcrypt = require("bcrypt");
//THIS MIDDLEWARE WILL CHECK THE SIGNIN ROUTES OF THE APP
function checkinSignInMiddleware(databasemodels) {
  return async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const existingUser = await databasemodels.findOne({ email: email });
      req.existingUser = existingUser;

      if (!existingUser) {
        return res.status(404).json({
          error: "The user not found , try signning up",
        });
      }
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      // console.log(password);
      // console.log("is passowrd", isValidPassword);
      // console.log(existingUser.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid password",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        error: "Server error while signning in" + error,
      });
    }
  };
}
module.exports = {
  checkinSignInMiddleware,
};
