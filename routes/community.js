const express = require("express");
const router = express.Router();
const fs = require("fs");

/* GET community page. */
router.get("/", function (req, res, next) {
  fs.readFile("./views/community.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

/* GET board page. */
router.get("/popular", function (req, res, next) {
  fs.readFile("./views/popular_board.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

router.get("/daily", function (req, res, next) {
    fs.readFile("./views/daily_board.html", (err, data) => {
        if (err) {
        res.send("error");
        } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
        }
    });
});

router.get("/equipment", function (req, res, next) {
    fs.readFile("./views/equipment_board.html", (err, data) => {
        if (err) {
        res.send("error");
        } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
        }
    });
});

router.get("/tip", function (req, res, next) {
    fs.readFile("./views/tip_board.html", (err, data) => {
        if (err) {
        res.send("error");
        } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
        }
    });
});

router.get("/market", function (req, res, next) {
    fs.readFile("./views/market_board.html", (err, data) => {
        if (err) {
        res.send("error");
        } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
        }
    });
});

router.get("/promotion", function (req, res, next) {
    fs.readFile("./views/promotion_board.html", (err, data) => {
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
