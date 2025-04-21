const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//user schema
const User = new Schema({
  email: { type: String, unique: true },
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
  creatorId: ObjectId,
});

//Coursecreator Schema a.k.a Admin
const Admin = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
});

//purchases
const Purchase = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

//course Content
const ContentOfCourse = new Schema({
  content: String,
  courseId: ObjectId,
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
