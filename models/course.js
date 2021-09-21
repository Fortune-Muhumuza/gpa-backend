const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

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
    university: {
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
    numOfTimesVisited: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, "a course must have a category"],
    },
    images: [String],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.pre("save", function (next) {
  this.name = slugify(this.name);
  next();
});
courseSchema.pre(/find/, function (next) {
  this.populate({
    path: "university",
    select: "name code",
  });
  next()
});
const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;
