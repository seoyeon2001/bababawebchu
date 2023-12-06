const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
    writer : { // 유저 아이디
        type : Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    id: { //게시글 번호
        type : String,
        required : true
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
    category:{
        type: String,
        enum: ['popular', 'daily','equipment','tip','market','promotion']    
    }
})
 
const Board = mongoose.model('Board', boardSchema);
 
module.exports = Board;