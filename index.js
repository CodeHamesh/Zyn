const express = require("express");
const app = express();
require('dotenv').config();
const path = require('path')
let connectMongoDB = require('./utils/connectMongoDB.js');
const {Auth} = require('./middlewares/auth.js');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs")
app.set("views",path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs',ejsMate)
app.use(cookieParser())
app.use(express.json())
const methodOverrride = require('method-override');

const authRouter = require('./routers/authRouter.js');
const searchRouter = require('./routers/searchRouter.js');
const activityRouter = require('./routers/activityRouter.js');
const homeRouter = require('./routers/homePageRouter');
const showFlashMsg = require("./middlewares/showflashmsgmiddleware.js");
const isAuthenticated = require("./middlewares/isAuthenticated.js");

connectMongoDB().then((res)=>{
    console.log(`mongoDB connect`);
    app.listen(process.env.PORT,()=>{
        console.log(`server listen port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log(`mongoDB Error ${err}`);
})

app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(methodOverrride('_method'))
app.use(showFlashMsg) // flashMsgMiddleware 
app.use(isAuthenticated) ;// isAuthenticated // yeh middleware chek krta hai h user login hai ya nhi us hisab se nav ko update krta ha

app.get("/",Auth,async(req,res,next)=> {
    let userId = req.userInfo.userId
    res.render("Home.ejs",{title:"Zyn.Home",stylepath:'/css/home.css',userId})
})
app.use('/home',homeRouter);
app.use("/search",searchRouter);
app.use("/activity",activityRouter);
app.use('/api/auth',authRouter);


app.use((req,res,next)=>{
    return res.send(`404 page not found`)
})
app.use((err,req,res,next)=>{
    if (err) {
        return res
        .cookie('flasherr',`${err.message}`)
        .redirect('/home')
    }else{
        next(err)
    }
})

