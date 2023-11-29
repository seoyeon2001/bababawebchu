const mongoose = require("mongoose");

const connect = async () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  await mongoose.connect("mongodb://root:1234@127.0.0.1:27017/admin", {
    dbName: "pangpang",
  });
};

mongoose.connection.on("error", (error) => {
  console.error("mongoDB 연결 에러", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("mongoDB 연결 종료됨");
  connect();
});

module.exports = { mongoose, connect };
