const express = require("express");
const mongoose = require("../mongoose/index.js");
const Match = require("../mongoose/schemas/match.js");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();
const { verifyToken } = require("./middlewares.js");

const ejs = require('ejs');


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

/* GET match content page. */
router.get("/read", function (req, res, next) {
  fs.readFile("./views/read_match.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});  


const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 매치글의 수

router.get("/list", async function (req, res, next) {
  try {
    const page = req.query.page || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;

    const matchList = await Match.find({title: title , writer:writer, createdAt:createdAt})
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    console.log("Match list fetched:", matchList);

    const totalMatches = await Match.countDocuments();
    const totalPages = Math.ceil(totalMatches / ITEMS_PER_PAGE);

    // JSON 데이터를 먼저 클라이언트에게 반환합니다.
    res.json({ 
      boards: matchList, // matchList를 'boards'라는 이름으로 반환합니다.
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalMatches,
      hasPrevPage: page > 1,
      nextPage: +page + 1,
      prevPage: page - 1,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error("Error fetching match list:", err);
    res.send("Error fetching match list");
  }
});

module.exports = router;
