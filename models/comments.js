const mongoose = require('mongoose');
let {Schema , model } = mongoose

let commentsSchema = new Schema({
    commentUserid:{
       type:Schema.Types.ObjectId,
       ref:'User',
       required:true,
       index:true
    },
    postid:{
        type:Schema.Types.ObjectId,
        ref:"posts",
        required:true,
        index:true
    },
    comment:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now,
        required:true
    }
},{timestamps:true})

let Comment = model('Comment',commentsSchema)
module.exports = Comment