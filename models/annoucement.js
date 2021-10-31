const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "A file must have a body"],
    },
    title: {
      type: String,
      required: [true, "A file must have a title"],
    },
   
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    
    course_unit: {
      type: mongoose.Schema.ObjectId,
      ref: "CourseUnit",
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "CourseUnit",
    },
 
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

announcementSchema.pre(/find/, function (next) {
  this.populate({
    path: "course_unit  ",
    select: "name  code courses_attached_to ",
  });
  next();
});
const announcementModel = mongoose.model("Annoucement", announcementSchema);

module.exports = announcementModel;
