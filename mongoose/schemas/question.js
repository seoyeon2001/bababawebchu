const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    writer : { // 유저 아이디
        type : String,
        required : true,
    },
    title: { // 제목
        type : String,
        required : true
    },
    content : { // 내용
        type : String,
        required : true
    },
    createdAt:{ // 글을 작성한 날짜 
        type : Date,
        default : Date.now,
        required : true
    }
})
 
const Question = mongoose.model('Question', questionSchema);
 
module.exports = Question;