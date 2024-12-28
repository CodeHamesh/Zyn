const authRouter = require('express').Router()
require('dotenv').config()
const {userSignup, signupPage} = require('../controller/userSignup');
const { userLogin, loginPage } = require('../controller/userlogin');
const { logoute } = require('../controller/userlogoute');
const {sendForgotPassLink, resetPass, renderForgotPassTemplate} = require("../controller/forgotPass");
const { Auth } = require('../middlewares/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2


const { updateProfile } = require('../controller/profileUpdateHen');
const { userProfileRender, friendProfileRender } = require('../controller/profileAndFriProfile');
const Post = require('../models/post');
const Comment = require('../models/comments')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,     
  api_secret: process.env.CLOUDINARY_API_SECRET
})



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
    limits: { fileSize: 4 * 1024 * 1024 }, 
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




authRouter.get("/profile",Auth,userProfileRender)
authRouter.get("/friend-profile/:friendId",Auth,friendProfileRender)
authRouter.patch("/profile/:userId",Auth,upload.single('profilePicture'),updateProfile)
authRouter.get("/signup",signupPage)
authRouter.post('/signup',userSignup)
authRouter.get("/login",loginPage)
authRouter.post("/login",userLogin)
authRouter.post("/logout",logoute);
authRouter.post("/forgotpass",sendForgotPassLink);
authRouter.get("/restpass/:token",renderForgotPassTemplate);
authRouter.post("/resetpass/:token",resetPass);

authRouter.post('/post/delete/:postid',Auth,async(req,res,next)=>{
    try {
        let {postid} = req.params
        let userid = req.userInfo.userId
        let findPost = await Post.findById(postid);
        if (!findPost) {
            return res 
            .cookie('flasherr','Error')
            .redirect('/home')
        }
        await Comment.deleteMany({postid:postid})
        await Post.findByIdAndDelete(postid)
        let allPosts = await Post.find({postuserid:userid}).populate('postuserid','username profilePicture')
        return res.json({ success: true, message: "Post deleted successfully" });
  
    } catch (err) {
        next(err)
    }
})


module.exports = authRouter