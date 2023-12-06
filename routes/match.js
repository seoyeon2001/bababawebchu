const express = require("express");
const mongoose = require("../mongoose/index.js");
const User = require("../mongoose/schemas/match.js");
const router = express.Router();
const fs = require("fs");

mongoose.connect();

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
    const page = req.query.page || 1; // 쿼리 파라미터로 현재 페이지를 받아옴
    const skipItems = (page - 1) * ITEMS_PER_PAGE; // 건너뛸 매치글 수

    // 데이터베이스에서 매치글을 가져오는 쿼리를 실행하고 페이지에 맞게 필요한 매치글만 가져옴
    const matchList = await Match.find({})
      .sort({ createdAt: -1 }) // 최신순으로 정렬 (createdAt은 매치글 생성 시간을 가정)
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    const totalMatches = await Match.countDocuments(); // 전체 매치글 수

    const totalPages = Math.ceil(totalMatches / ITEMS_PER_PAGE); // 전체 페이지 수 계산

    res.render("match", {
      matchList: matchList,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalMatches, // 다음 페이지 여부 확인
      hasPrevPage: page > 1, // 이전 페이지 여부 확인
      nextPage: +page + 1, // 다음 페이지 번호
      prevPage: page - 1, // 이전 페이지 번호
      totalPages: totalPages,
    });
  } catch (err) {
    res.send("Error fetching match list");
  }
});



module.exports = router;
