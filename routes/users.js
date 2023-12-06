const express = require("express");
const mongoose = require("../mongoose/index.js");
const User = require("../mongoose/schemas/user.js");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require("dotenv").config();
const { verifyToken } = require("./middlewares.js");

mongoose.connect();

/* 마이페이지 보기 */
router.get("/", function (req, res, next) {
  fs.readFile("./views/mypage.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

/* 마이페이지에서 아이디 가져오기 */
router.get("/getid", verifyToken, async (req, res) => {
  console.log(req.decoded.id);
  const id = req.decoded.id;
  res.json({ user_id: id });
});

/* 마이페이지에서 이메일 가져오기 */
router.get("/getemail", verifyToken, async (req, res) => {
  console.log(req.decoded.email);
  const email = req.decoded.email;
  res.json({ user_email: email });
});

/* 비밀번호 변경 */
router.put("/changepassword", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const finduser = await User.find({ id: req.decoded.id });

  const user = finduser[0];

  crypto.pbkdf2(currentPassword, user.salt, 100000, 64, 'sha512', async (err, key) => {
    check_password = key.toString('base64');

    // 현재 비밀번호가 일치하는 경우
    if (check_password === user.pw) {
      crypto.pbkdf2(newPassword, user.salt, 100000, 64, 'sha512', async (err, key) => {
        hashedNewPassword  = key.toString('base64');

        await User.findOneAndUpdate( { id: req.decoded.id }, {$set : { pw: hashedNewPassword  }});
        res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
      })
    } else {
      res.json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

  });
});

/* 회원탈퇴 */
router.delete("/delete", verifyToken, async (req, res) => {
  const password = req.body.password; // 사용자가 입력한 현재 비밀번호

  const finduser = await User.find({ id: req.decoded.id });
  console.log(finduser);

  const user = finduser[0];

  crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', async (err, key) => {
    check_password = key.toString('base64');

    // 현재 비밀번호가 일치하는 경우
    if (check_password === user.pw) {
      await User.deleteOne({ id: user.id });
      res.json({ state: true, message: '회원 탈퇴가 성공적으로 완료되었습니다.' });
    } else {
      res.json({ state: false, message: '현재 비밀번호가 일치하지 않습니다.' });
    }

  });

});

/* 회원가입 페이지 보기 */
router.get("/join", function (req, res, next) {
  fs.readFile("./views/signup.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

/* 회원가입 */
router.post("/join", async (req, res) => {
  console.log(req.body);
  const { username, email, userid, password } = req.body;

  crypto.randomBytes(64, async (err, buf) => {
    const salt = buf.toString('base64');

    const user = {
      username: username,
      email: email,
      userid: userid,
      password: password,
      salt: salt,
    };

    console.log(user);

    crypto.pbkdf2(user.password, salt, 100000, 64, 'sha512', async (err, key) => {
      user.password = key.toString('base64');

      console.log(user);

      const result = await User.create({
        name: username,
        email,
        id: userid,
        pw: user.password,
        salt: salt,
      });
      console.log(result);

      res.json({ success: true });
    });
  });
});

/* 회원가입 시 아이디 중복 확인 */
router.post("/join/check-userid", async (req, res) => {
  try {
    const id = req.body.id; // 사용자가 입력한 id

    if (id === '') {
      alert('아이디를 입력해주세요.');
      return;
  }

    const findId = await User.find({ id: id }); // DB에서 id가 일치하는 것 찾기
    console.log(findId);

    if (findId.length !== 0) {
      // 사용중인 아이디
      res.json({ available: false, message: '이미 사용 중인 아이디입니다.' });
    } else {
      // 사용 가능한 아이디
      res.json({ available: true, message: '사용 가능한 아이디입니다.' });
    }
  } catch(err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

/* login page */
router.get("/login", async (req, res) => {
  fs.readFile("./views/login.html", (err, data) => {
    if (err) {
      res.send("error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

/* 로그인 버튼 클릭 */ 
router.post("/login/check", async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const password = req.body.password;

  const finduser = await User.find({ id: id });
  console.log(finduser);

  // 아이디가 존재하지 않은 경우
  if(finduser.length === 0) {
    res.json({ type: 'no_id' });
  } else {
    // 아이디가 존재하는 경우
    const user = finduser[0];

    crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', async (err, key) => {
      check_password = key.toString('base64');

      if (user.pw !== check_password) {
        // 비밀번호가 일치하지 않는 경우
        res.json({ type: 'wrong_pw' });
      } else {
        // 비밀번호가 일치하는 경우 - 이 때가 로그인 성공
        try {      
          const token = jwt.sign(
            { name: user.name, 
              email: user.email,
              id: user.id
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "120m",
              issuer: "토큰 발급자",
            }
          );  

          res.json({
            code: 200,
            message: "토큰이 발급되었습니다.",
            token, 
            type: 'right',
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            code: 500,
            message: "서버 에러",
          });
        }
      };

    });
  };

});


module.exports = router;
