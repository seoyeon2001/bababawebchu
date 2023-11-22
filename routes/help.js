const express = require("express");
const router = express.Router();
const fs = require("fs");

/* GET match notices page. */
router.get("/notices", function (req, res, next) {
  fs.readFile("./views/notices.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

/* GET match qna page. */
router.get("/qna", function (req, res, next) {
    fs.readFile("./views/qna.html", (err, data) => {
      if (err) {
        res.send("error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
});  

/* GET match faq page. */
router.get("/faq", function (req, res, next) {
    fs.readFile("./views/faq.html", (err, data) => {
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
