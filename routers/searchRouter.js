const { Auth } = require('../middlewares/auth');
const searchRouter = require('express').Router()
const {sendConnectionReq} = require("../controller/sendConnectionreq");
const { findFriends } = require('../controller/searchThenFindFriend');

searchRouter.get("/",Auth,(req,res,next)=>{
    res.render("search.ejs",{title:"Zyn.Search",stylepath:'/css/search.css'})
})
searchRouter.post("/finduser",Auth,findFriends) // frontend call krta h is api ko 
searchRouter.post("/connection/req/pending/:touserid",Auth,sendConnectionReq) //send connection req

module.exports = searchRouter