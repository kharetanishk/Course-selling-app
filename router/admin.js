const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_ADMIN_PASSWORD;
const { AdminModel, CourseModel, FreeCourseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { checkingMiddleware } = require("../Middleware/check");
const { checkinSignInMiddleware } = require("../Middleware/checksignin");
const { authMiddleware } = require("../Middleware/auth");
const course = require("./course");

//THIS ROUTE WILL SIGN UP THE ADMIN
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

//THIS ROUTE WILL SIGN IN THE ADMIN
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

//THIS ROUTE WILL HELP THE ADMIN TO CREATE COURSES
adminRouter.post("/course", authMiddleware(secret), async function (req, res) {
  const creatorId = req.userId;
  // console.log(creatorId);

  const { title, description, price, imageUrl } = req.body;
  try {
    const course = await CourseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creatorId: creatorId,
    })
      .then((value) => {
        //WILL TAKE CARE OF FREE COURSES IF AVAILABLE
        if (value.price === 0) {
          FreeCourseModel.create({
            courseName: value.title,
            courseId: value._id,
          });
        }
      })
      .catch((error) => {
        console.log(
          `THERE IS AN ERROR WHILE CREATING THE COURSE BY ADMIN CHECK THE PROMISE ${error}`
        );
      });

    res.status(200).json({
      message: "Course have been created",
      course,
    });
  } catch (error) {
    res.status(500).json({
      error: "SERVER ISSUES IN CREATING THE COURSES",
    });
  }
});

// USING THIS ROUTE THE ADMIN WILL GET ALL HIS/HER CREATED COURSES INFORMATION
adminRouter.get("/mycourse", authMiddleware(secret), async function (req, res) {
  const creatorId = req.userId;
  // console.log(creatorId);

  try {
    const courses = await CourseModel.find({
      creatorId: creatorId,
    });
    console.log(courses);

    const admin = await AdminModel.find({
      _id: creatorId,
    });

    //Essentials
    const adminName = admin.map((array) => array.firstName);
    const courseName = courses.map((array) => array.title);
    const priceOfCourse = courses.map((array) => array.price);
    const courseId = courses.map((array) => array._id);

    //output everything about the creaton of the course
    res.status(200).json({
      message: "HERE ARE THE COURSES THAT I HAVE (ADMIN) CREATED",
      DETAILS: [
        {
          adminName: adminName,
          courseName: courseName,
          priceOfCourse: priceOfCourse,
          courseId: courseId,
          creatorId: creatorId,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      error: "THE SERVER SIDE IS BUSY",
      error,
    });
  }
});

adminRouter.put("/course", authMiddleware(secret), async function (req, res) {
  const { title, description, price, imageUrl } = req.body;
  const creatorId = req.userId;

  try {
    const user = await CourseModel.findOne({
      creatorId: creatorId,
    });
    const course = await CourseModel.updateOne(
      {
        _id: user._id,
        creatorId: creatorId,
      },
      {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
      }
    );

    res.status(200).json({
      message: "the course have been updated",
      course,
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
    console.log(creatorId);
    try {
      const course = await CourseModel.find({
        creatorId: creatorId,
      });
      console.log(course);
      res.status(200).json({
        message: `here are your courses sir`,
        courses: course,
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
