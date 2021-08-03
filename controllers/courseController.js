const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const Course = require("./../models/course");

exports.registerCourse = catchAsync(async (req, res, next) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    status: "success",
    course,
  });
});

exports.getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({});

  res.status(200).json({
    status: "success",
    courses,
  });
});

exports.editCourse = catchAsync(async (req, res, next) => {
  console.log("the id is", req.params);
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(new AppError("No university found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    course,
  });
});
