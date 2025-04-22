const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_ADMIN_PASSWORD;
const { AdminModel, CourseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { checkingMiddleware } = require("../Middleware/check");
const { checkinSignInMiddleware } = require("../Middleware/checksignin");
const { authMiddleware } = require("../Middleware/auth");

adminRouter.post(
  "/signup",
  checkingMiddleware(AdminModel),
  async function (req, res) {
    //ZOD VALIDATION
    const requireBody = z
      .object({
        email: z.string().email(),
        password: z.string().min(6).max(20),
        firstName: z.string().min(2).max(40),
        lastName: z.string().min(2).max(40),
      })
      .strict();

    //PARSE THE ZOD DATA
    const parseData = requireBody.safeParse(req.body);
    console.log(parseData);

    if (!parseData.success) {
      const popErrorMessage = parseData.error.issues[0];
      return res.status(400).json({
        error: `${popErrorMessage.message.trim().toLocaleUpperCase()}`,
      });
    }
    //INPUTS THAT USER WILL POST
    const { email, password, firstName, lastName } = req.body;

    //HASHING THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 12);
    //ADDING THE INPUTS TO THE DATABASE
    try {
      await AdminModel.create({
        email: email,
        password: hashedPassword.toString(),
        firstName: firstName,
        lastName: lastName,
      });
      console.log("New user logged up");
      res.status(200).json({
        message: `YOU ARE SIGNED UP ${firstName}`,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

adminRouter.post(
  "/signin",
  checkinSignInMiddleware(AdminModel),
  async function (req, res) {
    const { email, password } = req.body;
    //AFTER CHECKING THE USER SHOULD ASSIGN WITH A TOKEN

    try {
      const existingUser = req.existingUser;
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        secret
      );
      //DO COKKIE LOGIC IN FUTURE
      res.status(200).json({
        message: `Welcome To the CourseLelo App `,
        token,
      });
    } catch (error) {
      res.status(500).json({
        error: "Server error in admin.js",
        error,
      });
    }
  }
);

adminRouter.post("/course", authMiddleware(secret), async function (req, res) {
  const creatorId = req.userId;
  const creatorName = creatorId.firstName;

  const { title, description, price, imageUrl } = req.body;
  try {
    const course = await CourseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: creatorId,
    });
    res.status(200).json({
      message: "Course have been created",
      courseId: course._id,
      creatorName: creatorName,
    });
  } catch (error) {}
});

adminRouter.put("/course", authMiddleware(secret), async function (req, res) {
  const { title, description, price, imageUrl } = req.body;
  const creatorId = req.userId;
  const creatorName = creatorId.firstName;
  console.log(course._id);
  try {
    const course = await CourseModel.updateOne(
      {
        _id: course._id,
        creatorId: creatorId,
      },
      {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
      }
    );
    console.log("the course have been updated");
    res.status(200).json({
      message: "the course have been updated",
      courseId: course._id,
      creatorName: creatorName,
    });
  } catch (error) {
    res.status(400).json({
      error: "some error while updating the course",
      error,
    });
  }
});

adminRouter.get(
  "/course/bulk",
  authMiddleware(secret),
  async function (req, res) {
    const creatorId = req.userId;
    const creatorName = creatorId.firstName;
    try {
      const course = await CourseModel.find({
        creatorId: creatorId,
        courseId: course._id,
      });
      res.status(200).json({
        message: `here are your courses sir ${creatorName}`,
        courses: course,
        creatorName: creatorName,
      });
    } catch (error) {
      res.status(500).json({
        error: "some error while getting the courses",
        error,
      });
    }
  }
);

module.exports = {
  adminRouter: adminRouter,
};
