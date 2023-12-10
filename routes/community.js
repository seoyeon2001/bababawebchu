const express = require("express");
const mongoose = require("../mongoose/index.js");
const Community = require("../mongoose/schemas/community.js");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();
const { verifyToken } = require("./middlewares.js");
const { ObjectId } = require('mongodb');
const path = require('path');


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

/* GET community write page. */
router.get("/write", async (req, res, next) => {
  fs.readFile("./views/write_board.html", (err, data) => {
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
  const { title, category, content } = req.body;

  await Community.create({
    writer: userid,
    title: title,
    category: category,
    content : content,
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

// 카테고리 한글로 변경
function categoryKor(gender) {
  if (gender == 'popular') {
    return '인기';
  } else if (gender == 'daily') {
    return '일일';
  } else if (gender == 'equipment') {
    return '장비';
  } else if (gender == 'tip') {
    return '꿀팁';
  } else if (gender == 'market') {
    return '장터';
  } else if (gender == 'promotion') {
    return '홍보';
  }
}

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

// 커뮤니티 리스트
const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 매치글의 수

router.get("/list", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;

    const totalCommunities = await Community.countDocuments();
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find({})
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    console.log("Community list fetched:", communityList);

    // JSON 데이터를 먼저 클라이언트에게 반환합니다.
    res.json({ 
      boards: communityList, // communityList를 'boards'라는 이름으로 반환합니다.
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalCommunities,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error("Error fetching community list:", err);
    res.status(500).send("Error fetching community list");
  }
});


router.get("/list/:userid", async function (req, res, next) {
  try {
    const userid = req.params.userid;
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;

    const totalCommunities = await Community.countDocuments();
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find({writer:userid})
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);
    console.log("Community list fetched:", communityList);

    // JSON 데이터를 먼저 클라이언트에게 반환합니다.
    res.json({ 
      boards: communityList, // communityList를 'boards'라는 이름으로 반환합니다.
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalCommunities,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages: totalPages,
    });
  } catch (err) {
    console.error("Error fetching community list:", err);
    res.status(500).send("Error fetching community list");
  }
});


router.get("/write_board", function (req, res, next) {
  fs.readFile("./views/write_board.html", (err, data) => {
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
