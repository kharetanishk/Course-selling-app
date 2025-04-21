const mongoose = require("mongoose");
const course = require("./router/course");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//user schema
const User = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  course: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  ],
});

//Coursecreator Schema a.k.a Admin
const Admin = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  creations: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  ],
});
//course schema
const Course = new Schema({
  title: String,
  decription: String,
  price: Number,
  imageUrl: String,
  creatorId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
  ],
});
//course Content
const ContentOfCourse = new Schema({
  content: String,
  courseId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  ],
});
//purchases
const Purchase = new Schema({
  courseId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  ],
  userId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

//CREATING MODEL
const UserModel = mongoose.model("users", User);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose.model("course", Course);
const PurchaseModel = mongoose.model("purchasedCourses", Purchase);
const ContentModel = mongoose.model("courseContent", ContentOfCourse);

//EXPORTING THE MODELS
module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
  ContentModel,
};
