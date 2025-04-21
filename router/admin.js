const { Router } = require("express");
const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
  res.send("admin signup");
});

adminRouter.post("/signin", (req, res) => {
  res.send("adming signin");
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
