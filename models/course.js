const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a university must have a name"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    university_id: {
      type: mongoose.Schema.ObjectId,
      ref: "University",
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      required: [true, "a university must have a code"],
      unique: true,
    },
    num_years: {
      type: Number,
      required: [true, "a course num years must be specified"],
    },
    category: {
      type: String,
      required: [true, "a university must have a category"],
    },
    images: [String],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;
