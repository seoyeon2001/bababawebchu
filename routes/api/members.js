const express = require("express");
const mongoose = require("../../mongoose/index.js");
const Member = require("../../mongoose/schemas/member.js");
const router = express.Router();

mongoose.connect();

router.get("/login", async (req, res) => {
  const members = await Member.find();
  console.log(members);
  res.send(members);
});

router.post("/login/signup", async (req, res) => {});

router.put("/", async (req, res) => {});

router.delete("/", async (req, res) => {});

module.exports = router;
