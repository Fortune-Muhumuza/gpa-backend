const catchAsync = require("../utils/catchAsync");
const File = require("./../models/file");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const { format } = require("util");
const Email = require("../utils/email");

const AppError = require("../utils/error");
const CourseUnit = require("./../models/courseUnit");
const User = require("./../models/user");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    console.log("the object is", el, allowedFields);

    if (!allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
const storage = new Storage({
  projectId: "gpa-elavator",
  keyFilename: "firebase-admin.json",
});
const bucket = storage.bucket("gs://gpa-elavator.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

exports.uploadFile = multer.single("file");
exports.saveFile = catchAsync(async (req, res, next) => {
  // console.log("the req is",req)
  let file = req.file;
  if (!file) return next(new AppError("please attach a file", 400));

  const downloadUrl = await uploadImageToStorage(file);
  const uploadedFile = await File.create({
    download_url: downloadUrl,
    name: file.originalname,
    file_size: Number(file.size) / 1000000,
    uploaded_by: req.user._id,
    file_type: file.mimetype.split("/")[1],
    category: req.body.category,
    ...req.body,
  });
  res.status(200).json({
    status: "success",
    uploadedFile,
  });
  const course_unit = await CourseUnit.findById(uploadedFile.course_unit);
  const users = await User.find({
    course_units_enrolled_to: req.body.course_unit,
  });

  users.forEach(async (user) => {
    const documentURL = `${req.protocol}://gpaelevator.com/${user.university.name}/${user.course.name}/${uploadedFile.id}`;

    await new Email(
      user,
      "document uploaded",
      "A document has been uploaded under the course unit"
    ).sendFileUploadNotification(
      course_unit.name,
      uploadedFile.academic_year,
      uploadedFile.custom_name,
      documentURL
    );
  });
});

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${Date.now()}_${file.originalname}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      resumable: false,
      public: true,
    });

    blobStream.on("error", (error) => {
      console.log("error is", error);

      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      );
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

exports.getAllFiles = catchAsync(async (req, res, next) => {
  const files = await File.find({});
  res.status(200).json({
    status: "success",
    files,
  });
});
exports.getDocumentDetails = catchAsync(async (req, res, next) => {
  const documentID = req.params.id;

  if (!documentID) return next(new AppError("document id not supplied", 404));
  const documentDetails = await File.findById(documentID);
  res.status(200).json({
    status: "success",
    documentDetails,
  });
});

exports.getCourseUnitFiles = catchAsync(async (req, res, next) => {
  const course_unit_id = req.params.id;
  const course_unit = await CourseUnit.findById(course_unit_id);
  if (!course_unit) return next(new AppError("course unit not found", 404));
  const files = await File.find({ course_unit: course_unit_id });
  if (files.length <= 0) return next(new AppError("no files found", 404));
  res.status(200).json({
    status: "success",
    files,
  });
});

exports.handleVideo = catchAsync(async (req, res, next) => {
  console.log("the body", req.body);

  if (!req.body.video_url && !req.body.video_title) return next();
  // console.log("the body", req);

  const uploadedFile = await File.create({
    download_url: req.body.video_url,
    name: req.body.video_title,
    video_title: req.body.video_title,
    uploaded_by: req.user._id,
    file_type: "video",
    ...req.body,
  });
  res.status(200).json({
    status: "success",
    uploadedFile,
  });
  const course_unit = await CourseUnit.findById(uploadedFile.course_unit);
  const users = await User.find({
    course_units_enrolled_to: req.body.course_unit,
  });
  users.forEach(async (user) => {
    const documentURL = `${req.protocol}://gpaelevator.com/${user.university.name}/${user.course.name}/${uploadedFile.id}`;

    await new Email(
      user,
      "document uploaded",
      "A document has been uploaded under the course unit"
    ).sendFileUploadNotification(
      course_unit.name,
      uploadedFile.academic_year,
      uploadedFile.custom_name,
      documentURL
    );
  });
});

exports.updateViewCount = catchAsync(async (req, res, next) => {
  const document = await File.findByIdAndUpdate(
    req.params.id,
    { $inc: { numOfTimesVisited: 1 } },

    { new: false, runValidators: false }
  );

  if (!document) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    document,
  });
});
exports.updateLikeCount = catchAsync(async (req, res, next) => {
  const document = await File.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },

    { new: false, runValidators: false }
  );

  if (!document) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    document,
  });
});

exports.deleteFile = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const document = await File.findByIdAndDelete(id);
  if (!document) return next(new AppError("no document with that id found"));
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUserDocuments = catchAsync(async (req, res, next) => {
  const user = req.user;
  const documents = await File.find({
    course_unit: { $in: user.course_units_enrolled_to },
  });

  res.status(200).json({
    status: "success",
    num_of_documents: documents.length,
    documents,
  });
});

exports.updateFileDetails = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, [
    "download_url",
    "numOfTimesVisited",
    "likes",
  ]);
  const file = await File.findByIdAndUpdate(
    req.params.file_id,
    // { $push: { courses_enrolled_to: course_id } },
    filteredBody,

    { new: true, runValidators: false }
  );
  res.status(200).json({
    status: "success",
    updated_File: file,
  });
});
