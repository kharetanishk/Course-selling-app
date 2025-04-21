const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const { AdminModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { checkingMiddleware } = require("../Middleware/check");
const { checkinSignInMiddleware } = require("../Middleware/checksignin");

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
        error: `${
          popErrorMessage.message.trim().toLocaleUpperCase() +
          popErrorMessage.path[0].trim().toLocaleUpperCase()
        }`,
      });
    }
    //INPUTS THAT USER WILL POST
    const { email, password, firstName, lastName } = req.body;

    //HASHING THE PASSWORD
    // console.log(password);
    const hashedPassword = await bcrypt.hash(password, 12);
    // console.log(hashedPassword);
    //ADDING THE INPUTS TO THE DATABASE
    await AdminModel.create({
      email: email,
      password: hashedPassword.toString(),
      firstName: firstName,
      lastName: lastName,
    });

    //CREATION OF THE NEW USER DONE
    res.status(200).json({
      message: `YOU ARE SIGNED UP ${firstName}`,
    });
  }
);

adminRouter.post("/signin", checkinSignInMiddleware(AdminModel), (req, res) => {
  const { email, password } = req.body;
  //AFTER CHECKING THE USER SHOULD ASSIGN WITH A TOKEN
  try {
    const token = jwt.sign(
      {
        email,
      },
      secret
    );
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
});

adminRouter.post("/course", (req, res) => {
  res.send("adming launched a new course");
});

adminRouter.put("/course", (req, res) => {
  res.send("admin has updated the course");
});

adminRouter.get("/course/bulk", (req, res) => {
  res.send("admin wants to know about his courses");
});

module.exports = {
  adminRouter: adminRouter,
};
