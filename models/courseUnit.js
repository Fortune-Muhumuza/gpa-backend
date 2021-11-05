const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const courseUnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a course unit must have a name"],
    },
    category: {
      type: String,
      required: [true, "a course unit must have a category"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    no_credit_units: {
      type: Number,
      default: 3,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    courses_attached_to: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      required: [true, "a course unit must have a code"],
      unique: true,
    },
    numOfTimesVisited: {
      type: Number,
      default: 0,
    },
    year: {
      type: Number,
      required: [true, "a course unit year must be specified"],
    },
    semester: {
      type: Number,
      required: [true, "a course unit semester must be specified"],
    },
    lecturer: {
      type: String,
     
    },
    images: [String],
    students_enrolled: [
      {
        user_id: { type: mongoose.Schema.ObjectId, ref: "User" },
        date_enrolled: { type: Date, default: Date.now() },
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
courseUnitSchema.pre("save", function (next) {
  this.name = slugify(this.name);
  next();
});
courseUnitSchema.pre(/find/, function (next) {
  this.populate({
    path: "courses_attached_to",
    select: "name university code ",
  });
  next();
});
const courseUnitModel = mongoose.model("CourseUnit", courseUnitSchema);

module.exports = courseUnitModel;
