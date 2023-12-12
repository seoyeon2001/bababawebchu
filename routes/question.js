const express = require("express");
const mongoose = require("../mongoose/index.js");
const Question = require("../mongoose/schemas/question.js");
const router = express.Router();
const fs = require("fs");
require("dotenv").config();
const { verifyToken } = require("./middlewares.js");
const { ObjectId } = require('mongodb');
const path = require('path');

/* GET Q&A page. */
router.get("/", function (req, res, next) {
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

/* GET Q&A write page. */
router.get("/write", async (req, res, next) => {
  fs.readFile("./views/write_qna.html", (err, data) => {
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
  const { title, description } = req.body;
  
  await Question.create({
    writer: userid,
    title: title,
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

/* GET Q&A 리스트 컨텐츠 페이지 */
router.get("/read/:id", async (req, res, next) => {
  const communityId = req.params.id;

  try {
    const objectId = new ObjectId(communityId);
    const result = await Question.findOne({ _id: objectId });

    if (result) {

      // HTML 파일을 읽어 데이터를 삽입
      const htmlFilePath = path.join('views', 'read_qna.html');
      let html = fs.readFileSync(htmlFilePath, 'utf8');

      // 데이터를 HTML에 삽입
      html = html.replace('{{question.title}}', result.title);
      html = html.replace('{{question.writer}}', result.writer);
      html = html.replace('{{question.createdAt}}', formatCreatedAt(result.createdAt));
      html = html.replace('{{question.content}}', result.content);
      

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