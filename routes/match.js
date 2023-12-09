const express = require("express");
const mongoose = require("../mongoose/index.js");
const Match = require("../mongoose/schemas/match.js");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();
const { verifyToken } = require("./middlewares.js");
const { ObjectId } = require('mongodb');
const path = require('path');


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
    title: title,
    state: "모집중",
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

// 날짜 형식 변경
function formatCreatedAt(dateString) {
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const formattedDate = `${year}년 ${formattedMonth}월 ${formattedDay}일 ${formattedHours}시 ${formattedMinutes}분`;
  return formattedDate;
}

// 성별 한글로 변경
function genderKor(gender) {
  if (gender == 'male') {
    return '남성';
  } else if (gender == 'female') {
    return '여성';
  } else if (gender == 'irrelevant') {
    return '성별 상관없음';
  }
}

/* GET match content page. */
router.get("/read/:id", async (req, res, next) => {
  const matchId = req.params.id;

  try {
    const objectId = new ObjectId(matchId);
    const result = await Match.findOne({ _id: objectId });

    if (result) {

      // HTML 파일을 읽어 데이터를 삽입
      const htmlFilePath = path.join('views', 'read_match.html');
      let html = fs.readFileSync(htmlFilePath, 'utf8');

      // 데이터를 HTML에 삽입
      html = html.replace('{{match.title}}', result.title);
      html = html.replace('{{match.state}}', result.state);
      html = html.replace('{{match.writer}}', result.writer);
      html = html.replace('{{match.createdAt}}', formatCreatedAt(result.createdAt));
      html = html.replace('{{match.sport}}', result.sport);
      html = html.replace('{{match.location}}', result.location);
      html = html.replace('{{match.people}}', `${result.people}명`);
      html = html.replace('{{match.price}}', `${result.price}원`);
      html = html.replace('{{match.gender}}', genderKor(result.gender));
      html = html.replace('{{match.content}}', result.content);

      // 클라이언트에 HTML 응답 전송
      res.send(html);
    } else {
      res.status(404).json({ error: '글을 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});  

const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 매치글의 수

router.get("/list", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;

    const totalMatches = await Match.countDocuments();
    const totalPages = Math.ceil(totalMatches / ITEMS_PER_PAGE);

    const matchList = await Match.find({})
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    console.log("Match list fetched:", matchList);

    // JSON 데이터를 먼저 클라이언트에게 반환합니다.
    res.json({ 
      boards: matchList, // matchList를 'boards'라는 이름으로 반환합니다.
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalMatches,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error("Error fetching match list:", err);
    res.status(500).send("Error fetching match list");
  }
});


module.exports = router;
