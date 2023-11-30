const express = require("express");
const mongoose = require("../mongoose/index.js");
const User = require("../mongoose/schemas/user.js");
const router = express.Router();
const fs = require("fs");

mongoose.connect();

/* login page */
router.get("/", function (req, res, next) {
  fs.readFile("./views/login.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

router.post("/", async (req, res) => {});

/* join page */
router.get("/join", function (req, res, next) {
  fs.readFile("./views/signup.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

router.post("/join", async (req, res) => {});

/* mypage page */
router.get("/mypage", async (req, res) => {});

module.exports = router;
