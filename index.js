const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { courseRouter } = require("./router/course");
const { userRouter } = require("./router/user");
const { adminRouter } = require("./router/admin");
const mongoUrl = process.env.MONGO_URL;
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());

//ROUTERS
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

//DATABASE SHOULD CONNECT FIRST THEN THE APP SHOULD LISTEN

async function main() {
  await mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log(`the mongoose database connected successfully`);
    })
    .catch((error) => {
      console.log(`the database connection failed + ${error}`);
    });

  app.listen(port, () => {
    console.log(`the app is listening to port ${port}`);
  });

  console.log("waiting for the app to run");
}

main();
