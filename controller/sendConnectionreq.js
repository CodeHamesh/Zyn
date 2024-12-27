const User = require('../models/User');
const Connection = require('../models/Connection');
async function sendConnectionReq(req,res,next){
    try {
     let fromuserid =  req.userInfo.userId
     let {touserid} = req.params
     if (touserid === fromuserid) {
         return res
         .cookie("flasherr", 'You cannot send a friend request to yourself')
         .redirect('/search')
        //  .json({ message: "You cannot send a friend request to yourself" });
        
     }
     let chekIds = await User.findOne({_id:touserid})
     if (!chekIds) {
         return res
         .cookie("flasherr",'touserid not a valid id')
         .redirect("/search")
        //  .json({message:"touser id not a valid id"})
        
     }
     let chekConnectionInDb = await Connection.findOne({ $or: [
         { fromuserid, touserid }, // Outgoing request
         { fromuserid: touserid, touserid: fromuserid } // Incoming request
     ] });
  
     if (!chekConnectionInDb) {
         let newConnection = new Connection({
             fromuserid,
             touserid,
             status:'pending'
          })
          await newConnection.save()
          return res
          .cookie("flashmsg",'friend request sent successfully')
          .redirect('/search')
        //   .json({message:"friend request sent successfully"})
        
     }
     if (chekConnectionInDb.fromuserid.toString() == fromuserid) {
          if (chekConnectionInDb.status == 'pending') {
             return res
              .cookie("flasherr", 'friend request already sent')
              .redirect("/search")
            //   .json({ message: "friend request already sent" });  
          }else if(chekConnectionInDb.status == 'accept'){
             return res
              .cookie("flashmsg", 'you are already friends')
              .redirect("/search")
            //   .json({ message: "you are already friends" });
          }else if(chekConnectionInDb.status == 'reject'){
               await Connection.findByIdAndUpdate({_id:chekConnectionInDb._id},{
                   status:"pending"
               })
               return res
               .cookie('flashmsg',"you can send the friend request again")
               .redirect('/search')
            //    .json({message:"you can send the friend request again"})
          }
     }
     if (chekConnectionInDb.fromuserid.toString() == touserid) {
         if (chekConnectionInDb.status == 'pending') {
             return res
             .cookie("flasherr", 'this user has already sent you a request')
             .redirect('/search')
            //  .json({ message: "this user has already sent you a request" });
         } else if(chekConnectionInDb.status == 'accept'){
             return res
             .cookie("flashmsg", 'you are already friends')
             .redirect('/search')
            //  .json({ message: "you are already friends" });
         } else if(chekConnectionInDb.status == 'reject'){
             let newConnection = new Connection({
                 fromuserid,
                 touserid,
                 status:'pending'
              })
              await newConnection.save()
              return res
              .cookie("flashmsg",'friend request sent successfully')
              .redirect('/search')
            //   .json({message:"friend request sent successfully"})
         }
     }
    } catch (err) {
     next(err)
    }
 
 }

async function acceptConnectionReq (req,res,next){
    try {
     let {connectionId} = req.params
     let findConnection =  await Connection.findOne({_id:connectionId,status:"pending"})
     let fromuseridjisnemerepssreqbhejithiuskiid = findConnection.fromuserid
     if (!findConnection) {
       return res 
       .cookie("flasherr",'This req not found')
       .redirect("/activity")
     }
     findConnection.status = 'accept'
     await findConnection.save()
     let bothfriends = new Connection({
       fromuserid:req.userInfo.userId,
       touserid:fromuseridjisnemerepssreqbhejithiuskiid,
       status:"accept"
     })
     await bothfriends.save()
     return res
     .cookie("flashmsg",`Request accepted! We're friends now 😊🎉`)
     .redirect("/activity")
    } catch (err) {
       next(err)
    }
 }

 async function deleteConnectionReq(req,res,next){
   let {connectionId} = req.params
 let findConnection =  await Connection.findOne({_id:connectionId})
 if (!findConnection) {
   return res 
   .cookie("flasherr",'connection Id not valid')
   .redirect('/activity')
 }
 findConnection.status = 'reject'
 await findConnection.save()
 return res 
 .redirect("/activity")
}

 module.exports = {
    sendConnectionReq,
    acceptConnectionReq,
    deleteConnectionReq
 }