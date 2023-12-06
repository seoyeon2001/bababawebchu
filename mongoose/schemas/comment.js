const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    writer : { // 유저 아이디
        type : String,
        required : true,
    },
    content : { // 내용
        type : String,
        required : true
    },
    createdAt:{ // 댓글을 작성한 날짜 
        type : Date,
        default : Date.now,
        required : true
    },
    // id: { //댓글 번호
    //     type : String,
    //     required : true
    // },

    
})
 
 
 
 const Comment = mongoose.model('Comment', commentSchema);
 
 module.exports =  Comment;