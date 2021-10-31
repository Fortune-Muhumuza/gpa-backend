const catchAsync = require("../utils/catchAsync");
const Announcement = require("../models/annoucement");
const AppError = require("../utils/error");
const Course = require("../models/course");
const CourseUnit = require("../models/courseUnit");
exports.createAnnouncement = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const announcement = await Announcement.create({
    created_by: user,
    ...req.body,
  });
  res.status(201).json({
    status: "success",
    announcement,
  });
});
exports.updateAnnouncement = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const announcement = await Announcement.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!announcement)
    return next(new AppError("no announcement with that if found"));
  res.status(201).json({
    status: "success",
    announcement,
  });
});

exports.getAnnouncements = catchAsync(async (req, res, next) => {
  const announcements = await Announcement.find({});

  res.status(200).json({
    status: "success",
    announcements,
  });
});

exports.getAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) return next(new AppError("Announcement  not found", 404));
  res.status(200).json({
    status: "success",
    announcement,
  });
});

exports.getCourseAnnouncement = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return next(new AppError("course  with that name not found", 404));
  const announcement = await Announcement.find({
    course: course.id,
  });
  if (!announcement) return next(new AppError("No announcements found", 404));

  res.status(200).json({
    status: "success",
    announcement,
  });
});
exports.getCourseUnitAnnouncement = catchAsync(async (req, res, next) => {
  const courseUnit = await CourseUnit.findById(req.params.id);
  console.log("the course unit is", req.params);
  if (!courseUnit) return next(new AppError("CourseUnit   not found", 404));
  const announcement = await Announcement.find({
    course_unit: courseUnit.id,
  });
  if (!announcement) return next(new AppError("No announcements found", 404));

  res.status(200).json({
    status: "success",
    announcement,
  });
});
