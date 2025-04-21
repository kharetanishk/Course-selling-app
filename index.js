const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { courseRouter } = require("./router/course");
const { userRouter } = require("./router/user");
const { adminRouter } = require("./router/admin");

const app = express();
const port = 3000;

app.use(express.json());
//routers
app.use("/api/v1/user", userRouter); //this means all the request from
//  the user path will handle by userRouter
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(port, () => {
  console.log("the app is running in port " + port);
});
