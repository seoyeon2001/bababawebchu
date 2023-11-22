const express = require("express");
const router = express.Router();
const fs = require("fs");

/* GET login page. */
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

/* GET signup page. */
router.get("/signup", function (req, res, next) {
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

module.exports = router;
