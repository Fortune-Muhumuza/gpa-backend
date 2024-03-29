const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const CourseUnit = require("./../models/courseUnit");
const Course = require("./../models/course");
const University = require("./../models/university");
const User = require("./../models/user");
const Email = require("../utils/email");

exports.registerCourseUnit = catchAsync(async (req, res, next) => {
  const course_unit = await CourseUnit.create(req.body);

  res.status(201).json({
    status: "success",
    course_unit,
  });
  await new Email(
    { email: "gpanotifications@gmail.com" },
    "course_unit created",
    "a new course_unit has been created"
  ).sendNotification("course_unit", course_unit.name);
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
    return next(new AppError("No course unit found with that id", 404));
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
      university: university.id,
    });
    if (!course)
      return next(new AppError("course  with that name not found", 404));
    const courseUnit = await CourseUnit.findOne({
      name: req.query.course_unit,
      courses_attached_to: course.id,
    });
    if (!courseUnit)
      return next(new AppError("course unit with that name not found", 404));

    courseUnit.uni_name = university.name;

    res.status(200).json({
      status: "success",
      courseUnit,
      uni_name: university.name,
      logo: university.logo,
    });
  }
);
exports.getCourseUnitByCourseId = catchAsync(async (req, res, next) => {
  const courseId = req.query.course;
  if (!courseId) return next(new AppError("please supply a course ID", 404));
  const course = await Course.findById(courseId);
  if (!course)
    return next(new AppError("course  with that name not found", 404));

  const courseUnits = await CourseUnit.find({
    courses_attached_to: courseId,
  });
  if (!courseUnits)
    return next(new AppError("course unit with that name not found", 404));

  res.status(200).json({
    status: "success",
    courseUnits,
  });
});
exports.getCourseUnitByUniversityId = catchAsync(async (req, res, next) => {
  const university_id = req.query.id;
  if (!university_id)
    return next(new AppError("please supply a university ID", 404));
  const university = await University.findById(university_id);
  if (!university)
    return next(new AppError("university  with that name not found", 404));

  const courseUnits = await CourseUnit.find({
    courses_attached_to: university_id,
  });
  if (!courseUnits)
    return next(new AppError("course unit with that name not found", 404));

  res.status(200).json({
    status: "success",
    courseUnits,
  });
});

exports.getUsersEnrolled = catchAsync(async (req, res, next) => {
  const course_unit_id = req.params.id;
  const course_unit = await CourseUnit.findById(course_unit_id);
  if (!course_unit) return next(new AppError("course_unit not found", 404));
  const users = await User.find({
    course_units_enrolled_to: course_unit_id,
  }).select(
    "-course_units_enrolled_to -university -course -password -_id -createAt -image -__v"
  );
  res.status(200).json({
    status: "success",
    course_unit: course_unit.name,
    number_of_students_enrolled: users.length,
    students: users,
    lecturer:course_unit.lecturer
  });
});

exports.enrollUser = catchAsync(async (req, res, next) => {
  const course_unit_id = req.params.id;
  const course_unit = await CourseUnit.findById(course_unit_id);
  if (!course_unit) return next(new AppError("course unit not found", 404));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { course_units_enrolled_to: course_unit_id } },

    { new: true, runValidators: false }
  );
  res.status(200).json({
    success: "success",
    message: "user succsssully enrolled",
    user,
  });
});

exports.unregisterCourseUnit = catchAsync(async (req, res, next) => {
  const course_unit_id = req.params.id;
  const course_unit = await CourseUnit.findById(course_unit_id);
  if (!course_unit) return next(new AppError("course unit not found", 404));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pullAll: { course_units_enrolled_to: [course_unit_id] } },

    { new: true, runValidators: false }
  );
  res.status(200).json({
    success: "success",
    message: "course_unit deregistered",
    user,
  });
});

exports.deactivateCourseUnit = catchAsync(async (req, res, next) => {
  const course_unit_id = req.params.id;
  const course_unit = await CourseUnit.findByIdAndUpdate(
    course_unit_id,
    {
      active: false,
    },
    { new: true, runValidators: false }
  );
  if (!course_unit) return next(new AppError("couse unit was not found", 404));

  res.status(200).json({
    status: "success",
    message: "successfully deactivated course unit",
  });
});
