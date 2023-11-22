const express = require("express");
const router = express.Router();
const fs = require("fs");

/* GET match page. */
router.get("/", function (req, res, next) {
  fs.readFile("./views/match.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

/* GET match write page. */
router.get("/write", function (req, res, next) {
  fs.readFile("./views/write_match.html", (err, data) => {
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
