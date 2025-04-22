const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const { UserModel } = require("../db");
const { bcrypt } = require("bcrypt");
require("dotenv").config;
const jwt = require("jsonwebtoken");
const { checkingMiddleware } = require("../Middleware/check");
const { checkinSignInMiddleware } = require("../Middleware/checksignin");
const { authMiddleware } = require("../Middleware/auth");
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
        password: hashedPassword.tostring(),
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

userRouter.get("/purchases", authMiddleware(secret), function (req, res) {
  res.send("user purchased courses");
});

module.exports = {
  userRouter: userRouter,
};
