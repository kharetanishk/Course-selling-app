const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//user schema
const User = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  PurchasedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    },
  ],
});

//Coursecreator Schema a.k.a Admin
const Admin = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
});
//course schema
const Course = new Schema({
  title: String,
  decription: String,
  price: Number,
  imageUrl: String,
  creatorId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  ],
});
//course Content
const ContentOfCourse = new Schema({
  content: String,
  courseId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
//purchases
const Purchase = new Schema({
  userId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  courseId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const FreeCourses = new Schema({
  courseName: String,
  courseId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
//CREATING MODEL
const UserModel = mongoose.model("users", User);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose.model("course", Course);
const PurchaseModel = mongoose.model("purchasedCourses", Purchase);
const ContentModel = mongoose.model("courseContent", ContentOfCourse);
const FreeCourseModel = mongoose.model("freeContent", FreeCourses);

//EXPORTING THE MODELS
module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
  ContentModel,
  FreeCourseModel,
};
