const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A file must have a name"],
    },
    file_type: {
      type: String,
      required: [true, "A file must have a type"],
    },
    file_size: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "A file must have a category"],
    },
    num_of_pages: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    uploaded_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    academic_year: {
      type: String,
    },
    custom_name: {
      type: String,
    },
    download_url: {
      type: String,
    },
    video_title: {
      type: String,
    },
    video_url: {
      type: String,
    },
    num_pages: {
      type: String,
    },
    video_duration: {
      type: Number,
    },
    course_unit: {
      type: mongoose.Schema.ObjectId,
      ref: "CourseUnit",
    },
    numOfTimesVisited: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

fileSchema.pre(/find/, function (next) {
  this.populate({
    path: "course_unit  ",
    select: "name  code courses_attached_to ",
  });
  next();
});
const fileModel = mongoose.model("File", fileSchema);

module.exports = fileModel;
