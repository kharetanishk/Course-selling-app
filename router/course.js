const { Router } = require("express");
const courseRouter = Router();

courseRouter.get("/preview", function (req, res) {
  //seeing the available courses
  res.send("all courses");
});
module.exports = {
  courseRouter: courseRouter,
};
