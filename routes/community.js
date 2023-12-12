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

/* 글 저장 */
router.post("/write", verifyToken, async (req, res, next) => {
  const userid = req.decoded.id;
  const { title, category, description } = req.body;
  
  await Community.create({
    writer: userid,
    title: title,
    category: category,
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

/* GET 커뮤니티 리스트 컨텐츠 페이지 */
router.get("/read/:id", async (req, res, next) => {
  const communityId = req.params.id;

  try {
    const objectId = new ObjectId(communityId);
    const result = await Community.findOne({ _id: objectId });

    if (result) {

      // HTML 파일을 읽어 데이터를 삽입
      const htmlFilePath = path.join('views', 'read_board.html');
      let html = fs.readFileSync(htmlFilePath, 'utf8');

      // 카테고리 한글로 변경
      function categoryKor(category) {
        if (category == 'popular') {
          return '자유게시판';
        } else if (category == 'daily') {
          return '일일게시판';
        } else if (category == 'equipment') {
          return '장비게시판';
        } else if (category == 'tip') {
          return '꿀팁게시판';
        } else if (category == 'market') {
          return '장터게시판';
        } else if (category == 'promotion') {
          return '홍보게시판';
        }
      }

      // 데이터를 HTML에 삽입
      html = html.replace('{{community.title}}', result.title);
      html = html.replace('{{community.writer}}', result.writer);
      html = html.replace('{{community.createdAt}}', formatCreatedAt(result.createdAt));
      html = html.replace('{{community.category}}', categoryKor(result.category));
      html = html.replace('{{community.content}}', result.content);
      

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

/* GET edit community page. */
router.get('/edit/:id', async (req, res, next) => {
  const communityId = req.params.id;

  try {
    const objectId = new ObjectId(communityId);
    const result = await Community.findOne({ _id: objectId });
    const resultObject = result.toObject();

    if (resultObject) {

      // HTML 파일을 읽어 데이터를 삽입
      const htmlFilePath = path.join('views', 'edit_community.html');
      let html = fs.readFileSync(htmlFilePath, 'utf8');

      // 카테고리 한글로 변경
      function categoryKor(category) {
        if (category == 'popular') {
          return '자유게시판';
        } else if (category == 'daily') {
          return '일일게시판';
        } else if (category == 'equipment') {
          return '장비게시판';
        } else if (category == 'tip') {
          return '꿀팁게시판';
        } else if (category == 'market') {
          return '장터게시판';
        } else if (category == 'promotion') {
          return '홍보게시판';
        }
      }

      // 데이터를 HTML에 삽입
      html = html.replace('{{community.title}}', resultObject.title);
      html = html.replace('{{community.writer}}', resultObject.writer);
      html = html.replace('{{community.createdAt}}', resultObject.createdAt);
      html = html.replace('{{community.content}}', resultObject.content);
      html = html.replace('{{community.category}}', categoryKor(result.category));
      
      
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

router.patch('/edit/:id', async (req, res) => {
  try {
    const boardId = req.params.id;
    const updatedData = req.body;

    console.log(updatedData);
    
    const updatedCommunity = await Community.findByIdAndUpdate(boardId, updatedData, { new: true });

    if (!updatedCommunity) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '게시글이 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류입니다.' });
  }
});

/* DELETE community page. */
router.delete('/delete/:id', async (req, res) => {
  const communityId = req.params.id;

  try {
    // 보드 ID에 해당하는 데이터를 찾아서 삭제
    const result = await Community.findByIdAndDelete(communityId);

    if (result) {
      // 성공적으로 삭제된 경우
      res.json({ success: true, message: '게시글이 성공적으로 삭제되었습니다.' });
    } else {
      // 매치 ID에 해당하는 데이터가 없는 경우
      res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
    }
  } catch (error) {
    // 삭제 과정에서 오류가 발생한 경우
    console.error('Error deleting community:', error);
    res.status(500).json({ success: false, message: '게시글 삭제에 실패하였습니다.' });
  }
});

// popular
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

router.get("/list/popular", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const category = req.query.category; // 클라이언트로부터 카테고리 정보를 받아옴

    let query = { category: 'popular' }; // Filter by 'popular' category by default

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find(query)
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    res.json({ 
      boards: communityList,
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

// daily
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

router.get("/list/daily", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const category = req.query.category; // 클라이언트로부터 카테고리 정보를 받아옴

    let query = { category: 'daily' }; // Filter by 'daily' category by default

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find(query)
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    res.json({ 
      boards: communityList,
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

//equipment
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

router.get("/list/equipment", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const category = req.query.category; // 클라이언트로부터 카테고리 정보를 받아옴

    let query = { category: 'equipment' }; // Filter by 'equipment' category by default

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find(query)
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    res.json({ 
      boards: communityList,
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

// tip
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

router.get("/list/tip", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const category = req.query.category; // 클라이언트로부터 카테고리 정보를 받아옴

    let query = { category: 'tip' }; // Filter by 'tip' category by default

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find(query)
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    res.json({ 
      boards: communityList,
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

// market
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

router.get("/list/market", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const category = req.query.category; // 클라이언트로부터 카테고리 정보를 받아옴

    let query = { category: 'market' }; // Filter by 'market' category by default

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find(query)
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    res.json({ 
      boards: communityList,
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

//promotion
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

router.get("/list/promotion", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const category = req.query.category; // 클라이언트로부터 카테고리 정보를 받아옴

    let query = { category: 'promotion' }; // Filter by 'promotion' category by default

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find(query)
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    res.json({ 
      boards: communityList,
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

// 커뮤니티 리스트
const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 매치글의 수

router.get("/list", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;
    const category = req.query.category; // 클라이언트로부터 카테고리 정보를 받아옴

    let query = {}; // 기본적으로는 빈 객체로 설정하여 모든 게시글을 가져옴

    if (category) {
      query = { category: category }; // 클라이언트에서 category가 전달된 경우 해당 카테고리만 필터링
    }

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / ITEMS_PER_PAGE);

    const communityList = await Community.find(query)
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE);

    res.json({ 
      boards: communityList,
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
