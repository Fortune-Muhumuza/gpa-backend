const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/error");
const University = require("./../models/university");

exports.registerUniversity = catchAsync(async (req, res, next) => {
  const university = await University.create(req.body);

  res.status(201).json({
    status: "success",
    university,
  });
});

exports.getAllUniversities = catchAsync(async (req, res, next) => {
  const universities = await University.find({});

  res.status(200).json({
    status: "success",
    universities,
  });
});

exports.getUniversity = catchAsync(async (req, res, next) => {
  const university = await University.findById(req.params.id);
  if (!university) return next(new AppError("University not found", 404));
  res.status(200).json({
    status: "success",
    university,
  });
});

exports.editUniversities = catchAsync(async (req, res, next) => {
  console.log("the id is", req.params);
  const university = await University.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!university) {
    return next(new AppError("No university found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    university,
  });
});

exports.updatePopularCount = catchAsync(async (req, res, next) => {
  const university = await University.findByIdAndUpdate(
    req.params.id,
    { $inc: { numOfTimesVisited: 1 } },

    { new: false, runValidators: false }
  );

  if (!university) {
    return next(new AppError("No university found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    university,
  });
});

exports.getMostPopularUniversities = catchAsync(async (req, res, next) => {
  const universities = await University.find({})
    .sort({ numOfTimesVisited: -1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    universities,
  });
});
