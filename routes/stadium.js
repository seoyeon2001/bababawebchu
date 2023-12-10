const express = require("express");
const router = express.Router();
const fs = require("fs");

/* GET contest page. */
router.get("/", function (req, res, next) {
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

/* GET stadium info page. */
router.get("/baseball", function (req, res, next) {
  fs.readFile("./views/stadium_baseball.html", (err, data) => {
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
router.get("/tennis", function (req, res, next) {
  fs.readFile("./views/stadium_tennis.html", (err, data) => {
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
router.get("/futsal", function (req, res, next) {
  fs.readFile("./views/stadium_futsal.html", (err, data) => {
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
router.get("/foot", function (req, res, next) {
  fs.readFile("./views/stadium_foot.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
}); 


router.get("/all", function (req, res, next) {
    fs.readFile("./views/stadium_all.html", (err, data) => {
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
