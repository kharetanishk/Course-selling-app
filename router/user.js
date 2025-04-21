const { Router } = require("express");
const userRouter = Router();
const { UserModel } = require("../db");

userRouter.post("/signup", function (req, res) {
  res.send("hello signup");
});

userRouter.post("/signin", function (req, res) {
  res.send("hello signin");
});

userRouter.get("/purchases", function (req, res) {
  res.send("user purchased courses");
});

module.exports = {
  userRouter: userRouter,
};
