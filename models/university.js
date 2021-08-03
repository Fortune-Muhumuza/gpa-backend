const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a university must have a name"],
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
