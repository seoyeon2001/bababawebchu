var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const communityRouter = require("./routes/community");
const matchyRouter = require("./routes/match");
const infoRouter = require("./routes/info");
const helpRouter = require("./routes/help");
const membersRouter = require("./routes/api/members");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/community", communityRouter);
app.use("/match", matchyRouter);
app.use("/info", infoRouter);
app.use("/help", helpRouter);
app.use("/api/members", membersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 3000);
  res.send("something wrong!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("500번 오류!");
});

module.exports = app;
