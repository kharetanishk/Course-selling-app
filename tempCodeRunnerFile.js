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