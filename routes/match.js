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

function stateKor(state) {
  if (state == 'ing') {
    return '모집중';
  } else if (state == 'end') {
    return '모집완료';
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
      html = html.replace('{{match.state}}', stateKor(result.state));
      html = html.replace('{{match.writer}}', result.writer);
      html = html.replace('{{match.createdAt}}', formatCreatedAt(result.createdAt));
      html = html.replace('{{match.sport}}', result.sport);
      html = html.replace('{{match.location}}', result.location);
      html = html.replace('{{match.people}}', `${result.people}명`);
      html = html.replace('{{match.price}}', `${result.price}원`);
      html = html.replace('{{match.gender}}', genderKor(result.gender));
      html = html.replace('{{match.content}}', result.content);
      html = html.replace('{{match.matchDate}}', formatCreatedAt(result.matchDate));

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

/* GET edit match page. */
router.get('/edit/:id', async (req, res, next) => {
  const matchId = req.params.id;

  try {
    const objectId = new ObjectId(matchId);
    const result = await Match.findOne({ _id: objectId });
    const resultObject = result.toObject();

    if (resultObject) {

      // HTML 파일을 읽어 데이터를 삽입
      const htmlFilePath = path.join('views', 'edit_match.html');
      let html = fs.readFileSync(htmlFilePath, 'utf8');

      console.log(resultObject.writer);

      // 데이터를 HTML에 삽입
      html = html.replace('{{match.title}}', resultObject.title);
      html = html.replace('{{match.state}}', resultObject.state);
      html = html.replace('{{match.writer}}', resultObject.writer);
      html = html.replace('{{match.createdAt}}', resultObject.createdAt);
      html = html.replace('{{match.sport}}', resultObject.sport);
      html = html.replace('{{match.location}}', resultObject.location);
      html = html.replace('{{match.people}}', resultObject.people);
      html = html.replace('{{match.price}}', resultObject.price);
      html = html.replace('{{match.gender}}', resultObject.gender);
      html = html.replace('{{match.content}}', resultObject.content);
      html = html.replace('{{match.matchDate}}', resultObject.matchDate);

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

router.put('/edit/:id', async (req, res) => {
  try {
    const matchId = req.params.id;
    const updatedData = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(matchId, updatedData, { new: true });

    if (!updatedMatch) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '게시글이 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류입니다.' });
  }
});


const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 매치글의 수

router.get("/list", async (req, res, next) => {
  console.log('전체 리스트틀 불러옵니다.')
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

router.get("/list/:userid", async (req, res, next) => {
  console.log('내가 쓴 글 리스트를 불러옵니다.')
  try {
    const userid = req.params.userid;
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;

    const totalMatches = await Match.countDocuments();
    const totalPages = Math.ceil(totalMatches / ITEMS_PER_PAGE);

    const myList = await Match.find({writer: userid})
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    console.log("Match list fetched:", myList);

    // JSON 데이터를 먼저 클라이언트에게 반환합니다.
    res.json({ 
      boards: myList, // myList 'boards'라는 이름으로 반환합니다.
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

router.get('/date/list/:date', async (req, res, next) => {
  console.log('날짜별 리스트를 불러옵니다.')
  console.log(req.params.date);

  const originalDate = new Date(req.params.date)

  const year = originalDate.getFullYear();
  const month = originalDate.getMonth();
  const day = originalDate.getDate();

  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;

    const totalMatches = await Match.countDocuments();
    const totalPages = Math.ceil(totalMatches / ITEMS_PER_PAGE);

    const matchList = await Match.find( { 
      matchDate: {
        $gte: new Date(year, month, day), // 현재 날짜 이상
        $lt: new Date(year, month, day + 1) // 다음 날짜
      }
    })
    .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    console.log("날짜 별 매치 글 불러오기", matchList);

    // JSON 데이터를 먼저 클라이언트에게 반환합니다.
    res.json({ 
      boards: matchList, // matchList를 'boards'라는 이름으로 반환합니다.
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalMatches,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages: totalPages,
      date: req.params.date,
    });
  } catch (err) {
    console.error("Error fetching match list:", err);
    res.status(500).send("Error fetching match list");
  }
});

router.get('/date/:date', async (req, res, next) => {
  fs.readFile("./views/match_filter.html", (err, data) => {
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
