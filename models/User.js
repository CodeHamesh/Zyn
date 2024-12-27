const mongoose = require('mongoose');
const {Schema ,model} = mongoose;

const authSchema = new Schema({
    name:{
        type:String,
        required:true,
        minLength:3
    },
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:15,
        index: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    link:{
      type:String,
      required:false,
      maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    createdAt: {
        type: Date,
        required:true,
        default: Date.now, 
    },
    bio:{
        type:String,
        maxLength:30
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png", 
    }
})

const User = mongoose.model('User',authSchema);
module.exports = User
