const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    logo: {
      type: String,
    },
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
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      unique: true,
      required: [true, "a university must have a code"],
    },
    description: {
      type: String,
      required: [true, "a university must have a description"],
    },
    courseCategories: [String],
    numOfTimesVisited: {
      type: Number,
      default: 0,
    },
    links: [
      {
        uni_website: String,
        uni_portal: String,
        uni_elearning: String,
        uni_library: String,
        uni_admission: String,
        uni_scholarship: String,
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const universityModel = mongoose.model("University", universitySchema);

module.exports = universityModel;
