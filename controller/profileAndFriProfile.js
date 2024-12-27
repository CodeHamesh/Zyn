const User = require('../models/User');
const Connection = require('../models/Connection');
const Post = require('../models/post');
let Comment = require('../models/comments')

async function userProfileRender(req,res,next){
    try {
     let userId = req.userInfo.userId
     let loginUserDetails = await User.findById({_id:req.userInfo.userId}).select(["bio","link","username",'profilePicture','name'])
     let allFriendscount = await Connection.countDocuments({touserid:userId,status:'accept'})
     let allposts = await Post.find({postuserid:userId}).populate('postuserid','username profilePicture')
   //   let allpostsId = await Post.find({postuserid:userId}).select('_id') 
     let allFriend = await Connection.find({touserid:userId,status:'accept'}).populate("fromuserid")
   
      return res.render("profile.ejs",{title:`@${loginUserDetails.username}`,stylepath:'/css/profile.css',allposts,userId,loginUserDetails,allFriendscount,allFriend})
    } catch (err) {
     next(err)
    }
 }

async function friendProfileRender(req,res,next){
    try {
       let {friendId} = req.params
       let findFriendDeteles = await User.findOne({_id:friendId}).select(["bio","link","username",'profilePicture','name'])
       let findAllfriendsmyfriend = await Connection.find({touserid:friendId,status:'accept'}).populate("fromuserid")
       let findAllfriendsmyfriendcounts = await Connection.countDocuments({touserid:friendId,status:'accept'})
       let userId = req.userInfo.userId 
       let allposts = await Post.find({postuserid:friendId}).populate('postuserid','username profilePicture')
       return res.render("friendProfile.ejs",{title:`@${findFriendDeteles.username}`,stylepath:'/css/profile.css',allposts,userId,findAllfriendsmyfriendcounts,findAllfriendsmyfriend,findFriendDeteles})
    } catch (err) {
       next(err)
    } 
}

 module.exports = {
    userProfileRender,
    friendProfileRender
 }