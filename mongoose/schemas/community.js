const mongoose = require('mongoose');
const { Schema } = mongoose;

const communitySchema = new Schema({
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
    },
    removedAt:{ // 글을 삭제 날짜 
        type : Date,
        default : Date.now
    },
    editedAt:{ // 글을 수정한 날짜 
        type : Date,
        default : Date.now
    },
    category: {
        type: String,
        enum: ['daily', 'equipment', 'tip', 'market', 'promotion'],
        required: true
      }
})
 
const Community = mongoose.model('Community', communitySchema);
 
module.exports = Community;