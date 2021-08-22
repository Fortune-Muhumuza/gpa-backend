const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const CourseUnit = require("./../models/courseUnit");
const Course = require("./../models/course");
const University = require("./../models/university");

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
  console.log("the id is", req.params);
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
  console.log("reached here");

  const course_units = await CourseUnit.find({})
    .sort({ numOfTimesVisited: -1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    course_units,
  });
});

exports.getCourseUnitByUniNameAndCourseName = catchAsync(
  async (req, res, next) => {
    const university = await University.findOne({ name: req.query.uni_name });
    if (!university)
      return next(new AppError("university with that name not found", 404));

    const course = await Course.findOne({
      name: req.query.course_name,
      university_id: university.id,
    });
    if (!course)
      return next(new AppError("course with that name not found", 404));
    const courseUnit = await CourseUnit.findOne({
      name: req.query.course_unit,
      courses_attached_to: course.id,
    });
    if (!courseUnit)
      return next(new AppError("course unit with that name not found", 404));
    res.status(200).json({
      status: "success",
      courseUnit,
    });
  }
);
