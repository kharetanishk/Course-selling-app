//THIS MIDDLEWARE WILL CHECK THE SIGNUP ROUTES OF THE APP
function checkingMiddleware(databasemodels) {
  return async (req, res, next) => {
    const { email } = req.body;
    try {
      const searchUser = await databasemodels.findOne({ email });
      if (searchUser !== null) {
        res.status(400).json({
          error: `User already exists`,
        });
      }
      next();
    } catch (error) {
      console.log(`error in the middleware logic + ${error}`);
      res.status(500).json({
        error: "Server error while checking user",
      });
    }
  };
}

module.exports = {
  checkingMiddleware,
};
