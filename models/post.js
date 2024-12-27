const mongoose = require('mongoose');
const {Schema,model} =  mongoose;


function getIndianDate() {
   const date = new Date();
   const options = {
       timeZone: 'Asia/Kolkata',
       year: 'numeric',
       month: '2-digit',
       day: '2-digit',
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
       hour12: true,
   };
   return new Intl.DateTimeFormat('en-IN',options).format(date);
}

let postSchema = new Schema({
    postuserid:{
     type:Schema.Types.ObjectId,
     ref:"User",
     required:true,
     index:true
    },
   postcontent:{
        type:String,
        require:true,
        minLength:1,
        maxLength:350
     },
     postimg:{
        type:String,
        required:false,
     },
     postTime:{
        type:String,
        required:true,
        default: getIndianDate()
     },
     likes:{
      type:Number,
      default:0,
      required:false
     },
     likedby:[{
      type: Schema.Types.ObjectId,
      ref: "User" 
  }]
},{timestamps:true})


let Post = model('Post',postSchema)
module.exports = Post