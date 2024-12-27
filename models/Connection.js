const mongoose = require('mongoose');
const {Schema ,model} = mongoose;

let connectionSchema = new Schema({
    fromuserid:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true
    },
    touserid:{
         type:Schema.Types.ObjectId,
         ref:"User",
    },
    status: {
        type: String,
        enum: ["pending","accept", "reject"],
        required: true,
      }
},{timestamps:true})

connectionSchema.index({touserid:1,status:-1})
let Connection = model('Connection',connectionSchema)
module.exports = Connection