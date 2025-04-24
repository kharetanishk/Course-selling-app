const { Router } = require("express");
const { CourseModel } = require("../db");
const courseRouter = Router();

courseRouter.get("/preview", async function (req, res) {
  const courses = await CourseModel.find({});
  res.status(200).json({
    courses: courses,
  });
});
module.exports = {
  courseRouter: courseRouter,
};
