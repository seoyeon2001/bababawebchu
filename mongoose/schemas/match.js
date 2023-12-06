const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchSchema = new Schema({
    writer : { // 유저 아이디
        type : String,
        required : true,
    },
    state : { // 모집 상태
        type : String,
        required : true,
    },
    title: { // 제목
        type : String,
        required : true
    },
    location:{ //장소
        type : String,
        required : true
    },
    matchDate:{ //매치 날짜
        type : Date,
        required : true
    },
    price:{// 금액
        type : Number,
        required : true
    },
    people : { // 모집 인원 
        type : Number,
        required : true
    },
    gender:{ //성별
        type: String,
        enum: ['male', 'female','irrelevant'],
        required : true
    },
    sport:{ // 운동 종목
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
    },
    removedAt:{ // 글을 삭제 날짜 
        type : Date
    },
    editedAt:{ // 글을 수정한 날짜 
        type : Date
    }
})
 
const Match = mongoose.model('Match', matchSchema);
 
module.exports = Match;