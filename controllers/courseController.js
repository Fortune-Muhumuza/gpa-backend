const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const Course = require("./../models/course");
const User = require("./../models/user");
const University = require("./../models/university");

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
exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError("Course not found", 404));
  res.status(200).json({
    status: "success",
    course,
  });
});

exports.updatePopularCount = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { $inc: { numOfTimesVisited: 1 } },

    { new: false, runValidators: false }
  );

  if (!course) {
    return next(new AppError("No Course found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    course,
  });
});
exports.getMostPopularCourses = catchAsync(async (req, res, next) => {
  console.log("reached here");

  const courses = await Course.find({})
    .sort({ numOfTimesVisited: -1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    courses,
  });
});

exports.getCourseByUniversityName = catchAsync(async (req, res, next) => {
  const university = await University.findOne({ name: req.query.uni_name });
  if (!university)
    return next(new AppError("university with that name not found", 404));
  console.log("the course is", req.query.uni_name, req.query.course_name);
  const course = await Course.findOne({
    name: req.query.course_name,
    university: university.id,
  });
  if (!course)
    return next(new AppError("course with that name not found", 404));

  res.status(200).json({
    status: "success",
    course,
  });
});

exports.getUsersEnrolled = catchAsync(async (req, res, next) => {
  const course_id = req.params.id;
  const course = await Course.findById(course_id);
  if (!course) return next(new AppError("course not found", 404));

  const users = await User.find({
    course: course_id,
  }).select(
    "-course_units_enrolled_to -university -course -password -_id -createAt -image -__v"
  );
  res.status(200).json({
    status: "success",
    course: course.name,
    number_of_students_enrolled: users.length,
    students: users,
  });
});

exports.enrollUser = catchAsync(async (req, res, next) => {
  const course_id = req.params.id;
  const course = await Course.findById(course_id);
  if (!course) return next(new AppError("course not found", 404));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    // { $push: { courses_enrolled_to: course_id } },
    { course: course_id },

    { new: false, runValidators: false }
  );
  res.status(200).json({
    success: "success",
    message: "user succsssully enrolled",
  });
});

exports.getCoursesByUniversity_id = catchAsync(async (req, res, next) => {
  const university_id = req.params.university_id;
  const university = await University.findById(university_id);
  if (!university)
    return next(
      new AppError("university with not found with specified id", 404)
    );
  const courses = await Course.find({ university: university_id });
  res.status(200).json({
    status: "success",
    num_of_courses: courses.length,
    courses,
  });
});

exports.deactivateCourse = catchAsync(async (req, res, next) => {
  const course_id = req.params.id;
  const course_unit = await Course.findByIdAndUpdate(
    course_id,
    {
      active: false,

    },
    { new: true, runValidators: false }
  );
  if (!course) return next(new AppError("couse  was not found", 404));
  res.status(200).json({
    status: "success",
    message: "successfully deactivated course ",
  });
});
