const mongoose = require("mongoose");

const { Schema } = mongoose;

const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  id: {
    type: String,
    require: true,
  },
  pw: {
    type: String,
    require: true,
  },
});

const Member = mongoose.model("Member", memberSchema);
