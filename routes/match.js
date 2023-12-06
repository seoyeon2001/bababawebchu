const express = require("express");
const mongoose = require("../mongoose/index.js");
const Match = require("../mongoose/schemas/match.js");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();
const { verifyToken } = require("./middlewares.js");

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
router.get("/write", async (req, res, next) => {
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

router.post("/write", verifyToken, async (req, res, next) => {
  const userid = req.decoded.id;

  const { title, sport, location, time, fee, people, description, gender } = req.body;

  await Match.create({
    writer: userid,
    // id: ,
    title: title,
    location: location,
    matchDate: time,
    price: fee,
    people : people ,
    gender: gender,
    sport: sport,
    content : description,
    createdAt: new Date(),
  });
  res.json({ success: true });
});

module.exports = router;
