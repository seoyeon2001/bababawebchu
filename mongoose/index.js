const mongoose = require("mongoose");

const connect = async () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
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
