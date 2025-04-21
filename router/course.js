const { Router } = require("express");
const courseRouter = Router();
const { CourseModel } = require("../db");
const { PurchaseModel } = require("../db");
const { ContentModel } = require("../db");

courseRouter.get("/preview", function (req, res) {
  //seeing the available courses
  res.send("all courses");
});
courseRouter.post("/purchase", function (req, res) {
  //user need to pay money
  res.send("purchased this course");
});

module.exports = {
  courseRouter: courseRouter,
};
