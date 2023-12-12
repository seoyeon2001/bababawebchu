const express = require("express");
const router = express.Router();
const fs = require("fs");

/* GET contest page. */
router.get("/", function (req, res, next) {
  fs.readFile("./views/soccer.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

/* GET stadium info page. */
router.get("/stadium", function (req, res, next) {
  fs.readFile("./views/stadium.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});  

/* GET soccer game info page. */
router.get("/soccer", function (req, res, next) {
  fs.readFile("./views/soccer.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});  

/* GET hockey game info page. */
router.get("/hockey", function (req, res, next) {
  fs.readFile("./views/hockey.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
}); 

/* GET yeonchon game info page. */
router.get("/yeonchon", function (req, res, next) {
  fs.readFile("./views/yeonchon.html", (err, data) => {
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
