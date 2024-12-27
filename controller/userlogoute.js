
function logoute(req,res,next){
    try {
        // res.cookie("loginToken",null,{
        //     maxAge:0
        //    }),
        res
        .clearCookie('loginToken')
        .cookie("flashmsg","You have successfully logged out")
        .status(200).redirect('/home')

    } catch (err) {
        next(err)
    }
}

module.exports = {logoute}