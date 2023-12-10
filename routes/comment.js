const express = require("express");
const mongoose = require("../mongoose/index.js");
const Match = require("../mongoose/schemas/match.js");
const Comment = require("../mongoose/schemas/comment.js");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();
const { verifyToken } = require("./middlewares.js");
const { ObjectId } = require('mongodb');
const path = require('path');


// 댓글 작성
router.post('/', async (req, res) => {
  try {
    const { comment, boardId, writer } = req.body;

    await Comment.create({
      comment: comment,
      boardId: boardId,
      writer: writer,
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 특정 게시글에 속한 댓글 조회
router.get('/:boardId', async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const comments = await Comment.find({ boardId });
    res.json({success: true, comments: comments});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;