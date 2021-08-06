const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const CourseUnit = require("./../models/courseUnit");

exports.registerCourseUnit = catchAsync(async (req, res, next) => {
  const course_unit = await CourseUnit.create(req.body);

  res.status(201).json({
    status: "success",
    course_unit,
  });
});

exports.getAllCourseUnits = catchAsync(async (req, res, next) => {
  const course_units = await CourseUnit.find({});

  res.status(200).json({
    status: "success",
    course_units,
  });
});

exports.editCourseUnits = catchAsync(async (req, res, next) => {
    console.log("the id is",req.params)
  const course_unit = await CourseUnit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!course_unit) {
    return next(new AppError("No university found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    course_unit,
  });
});

exports.getCourseUnit = catchAsync(async (req, res, next) => {
  const course_unit = await CourseUnit.findById(req.params.id);
  if (!course_unit) return next(new AppError("Course Unit not found", 404));
  res.status(200).json({
    status: "success",
    course_unit,
  });
});
exports.updatePopularCount = catchAsync(async (req, res, next) => {
  const course_unit = await CourseUnit.findByIdAndUpdate(
    req.params.id,
    { $inc: { numOfTimesVisited: 1 } },

    { new: false, runValidators: false }
  );

  if (!course_unit) {
    return next(new AppError("No CourseUnit found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    course_unit,
  });
});
exports.getMostPopularCourseUnits = catchAsync(async (req, res, next) => {
  console.log('reached here');
  
  const course_units = await CourseUnit.find({})
    .sort({ numOfTimesVisited: -1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    course_units,
  });
});