const { Auth } = require('../middlewares/auth')
const Post = require('../models/post');
const express = require('express')
const multer = require('multer');
const Comment = require('../models/comments');
const homeRouter = require('express').Router()

const bodyParser = require('body-parser');  // For parsing JSON body
homeRouter.use(bodyParser.json());


let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() + Math.floor(Math.random()* 5)+ file.originalname)
    }
})

let upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(file.originalname);
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
})


homeRouter.get("/",Auth,async(req,res,next)=>{
try {
    let userId = req.userInfo.userId
    res.render("home.ejs",{title:"Zyn.Home",stylepath:'/css/home.css',userId})
} catch (err) {
    next(err)
}
})

homeRouter.get('/post/all',async(req,res,next)=>{
    try {
        let allPost = await Post.aggregate([
            { $sample: { size: 50 } }
        ])
        .exec();
        let allPosts = await Post.populate(allPost, {
            path: 'postuserid',
            select: 'username profilePicture _id'
        });
        return res.json(allPosts)
    } catch (err) {
        next(err)
    }
})

homeRouter.post("/post",Auth,upload.single('postimg'),async(req,res,next)=>{
   try {
    let postuserid = req.userInfo.userId
    let {postcontent} = req.body
    if (postcontent == '') {
        return res 
        .cookie('flasherr','Please add some text to your post ')
        .redirect("/home")
    }
    let postObj = {postuserid,postcontent}
    if (req.file) {
        postObj.postimg = `/uploads/${req.file.filename}`
    }
    let createPost = new Post(postObj)
    await createPost.save()
    return res
    .cookie("flashmsg",'Post uploaded successfully!')
    .redirect("/home")
   } catch (err) {
    next(err)
   }
})

homeRouter.post('/post/like/:postid',Auth,async(req,res,next)=>{
   try {
    let {postid} = req.params;
    let userid = req.userInfo.userId;
    let findPost = await Post.findById(postid);
    if (!findPost) {
        return res 
        .cookie('flasherr','Error')
        .redirect('/home')
    }
    const userIndex = findPost.likedby.indexOf(userid);
    if (userIndex !== -1) {
        findPost.likedby.splice(userIndex,1)
        findPost.likes -= 1 
        await findPost.save()
        return res 
        .json({data:findPost,liked:false})
    }else{
        findPost.likes += 1
        findPost.likedby.push(userid)
        await findPost.save()
        return res 
        .json({data:findPost,liked:true})
    }  
   } catch (err) {
    next(err)
   }
})

homeRouter.post('/post/comment/:postid',Auth,async(req,res,next)=>{
  try {
    let {comment} = req.body
    if (comment == '') {
        return res 
       .cookie('flasherr','Please enter a comment before posting.')
       .redirect('/home')
    }
    let {postid} = req.params
    let userid = req.userInfo.userId
    let findPost = await Post.findOne({_id:postid})
    if (!findPost) {
       return res 
       .cookie('flasherr','This post is not available')
       .redirect('/home')
    }
    let createComment = new Comment({
     commentUserid:userid,
     postid,
     comment,
    })
    await createComment.save()
    let allCommentsThidPost = await Comment.find({postid}).sort({ createdAt: -1}).select('commentUserid comment postid').populate('commentUserid','username profilePicture') 

    return res.json(allCommentsThidPost)
  } catch (err) {
    next(err)
  }
})

homeRouter.get('/post/comment/:postid',Auth,async(req,res,next)=>{
      let {postid} = req.params
      let allCommentsThidPost = await Comment.find({postid}).sort({ createdAt: -1}).select('commentUserid comment postid').populate('commentUserid','username profilePicture')
      let findPost = await Post.findOne({_id:postid}).select('_id postuserid').populate('postuserid',['username','profilePicture'])
    if (!findPost) {
       return res 
       .cookie('flasherr','This post is not available')
       .redirect('/home')
    }
   return res.json({postid,findPost,allCommentsThidPost})
})
module.exports = homeRouter

homeRouter.post('/post/comment/delete/:postid/:commentid',Auth,async(req,res,next)=>{
    try {
        let {commentid,postid} = req.params
        let findComment = await Comment.findById(commentid)
        if (!findComment) {
            return res
            .cookie('flasherr','Error')
            .redirect('/home')
        }
        await Comment.findByIdAndDelete(commentid)
        let allcommentsthispost = await Comment.find({postid:postid})
        return res.json({allcommentsthispost,delete:true}) 
    } catch (err) {
        next(err)
    }
})