const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const { UserModel, PurchaseModel, CourseModel } = require("../db");
require("dotenv").config;
const jwt = require("jsonwebtoken");
const { checkingMiddleware } = require("../Middleware/check");
const { checkinSignInMiddleware } = require("../Middleware/checksignin");
const { authMiddleware } = require("../Middleware/auth");
const bcrypt = require("bcrypt");
const secret = process.env.JWT_USER_PASSWORD;

userRouter.post(
  "/signup",
  checkingMiddleware(UserModel),
  async function (req, res) {
    const requireBody = z
      .object({
        email: z.string().email(),
        password: z.string().min(6).max(20),
        firstName: z.string().min(3).max(40),
        lastName: z.string().min(2).max(40),
      })
      .strict();

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
      const error = parseData.error.issues[0];
      return res.status(400).json({
        error: error.message,
      });
    }

    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await UserModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
      });

      res.status(200).json({
        message: "You are signned up",
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        error,
      });
    }
  }
);

userRouter.post(
  "/signin",
  checkinSignInMiddleware(UserModel),
  async function (req, res) {
    const { email, password } = req.body;
    const existingUser = req.existingUser;
    try {
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        secret
      );
      res.status(200).json({
        message: "Welcome to courselelo app",
        token,
      });
    } catch (error) {
      res.status(500).json({
        error: "Server errror in user.js",
        error,
      });
    }
  }
);
userRouter.post("/purchase", authMiddleware(secret), async function (req, res) {
  const userId = req.userId;
  console.log(userId + " " + "this is the user id");
  const { courseId } = req.body;
  //AVOID TWICE BUYING THE SAME COURSE TWICE LOGIC IN FUTURE
  //HERE YOU HAVE TO CREATE A PAYMENT GATEWAY OR CHECK THAT THE USER PAID OR NOT
  await PurchaseModel.create({
    userId: userId,
    courseId: courseId,
  });
  res.status(200).json({
    message: "THE COURSE HAn VE BEEN BUYED",
  });
});

userRouter.get("/purchase", authMiddleware(secret), async function (req, res) {
  const userId = req.userId;
  try {
    const course = await PurchaseModel.find({
      userId: userId,
    });

    res.status(200).json({
      message: "Here are the courses you have purchased",
      course: course,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error while getting the purchased course",
      error,
    });
  }
});
userRouter.get("/preview", async function (req, res) {
  try {
    const previewAllCourses = await CourseModel.find({}); //EMPTY INSIDE FIND MEANS GET ALL
    res.status(200).json({
      message: "these are the courses available in this platform ",
      previewAllCourses: previewAllCourses,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error while previewing the course",
      error,
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
