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
      required: [true, "A file must have a size"],
    },
    category: {
      type: String,
      required: [true, "A file must have a category"],
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
    download_url: {
      type: String,
      required: [true, "A file must have a url"],
    },
    course_unit: {
      type: mongoose.Schema.ObjectId,
      ref: "CourseUnit",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

fileSchema.pre(/find/, function (next) {
  this.populate({
    path:"course_unit",
    select:"name  code courses_attached_to "
  })
  next();
});
const fileModel = mongoose.model("File", fileSchema);

module.exports = fileModel;
