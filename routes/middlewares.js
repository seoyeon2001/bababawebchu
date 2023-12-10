const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.loggedin = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      alert("로그인이 필요합니다.");
      res.redirect("/login");
  }
};

exports.verifyToken = (req, res, next) => {
  // 인증 완료
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    // 인증 실패
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다.",
      error,
    });
  }
};
