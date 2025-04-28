const { Router } = require("express");
const { CourseModel, FreeCourseModel } = require("../db");
const courseRouter = Router();

//this course preview will be the first page of our application
courseRouter.get("/preview", async function (req, res) {
  const courses = await CourseModel.find({});
  res.status(200).json({
    courses: courses,
  });
});
module.exports = {
  courseRouter: courseRouter,
};

//let the user also know the free courses
courseRouter.get("/previewFreeContent", async function (req, res) {
  try {
    const freeCourses = await FreeCourseModel.find({});
    console.log(freeCourses);
    if (!freeCourses) {
      return res.status(400).json({
        error: "THERE IS NO FREE COURSES AVAILABLE ",
      });
    } else {
      res.status(200).json({
        message: "HERE ARE THE FREE COURSES ",
        freeCourses: freeCourses.map((courses) => courses.courseName),
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Some error in accessing free courses",
    });
  }
});
