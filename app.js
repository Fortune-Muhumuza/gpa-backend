const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./controllers/errorController");
const universityRouter = require("./routes/universityRoutes");
const courseRouter = require("./routes/courseRoutes");
const courseUnitRouter = require("./routes/courseUnitRoutes");
const fileRouter = require("./routes/fileRoutes");
const compression = require("compression");
const app = express();
// cors
app.use(
  cors({
    credentials: true,
  })
);
app.all("*", cors());
app.options("*", cors());

app.use(morgan("dev"));
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/universities", universityRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/courseUnits", courseUnitRouter);
app.use("/api/v1/files", fileRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "error end point not found", 
    message: req.originalUrl,
  });
});

app.use(errorHandler);
module.exports = app;
