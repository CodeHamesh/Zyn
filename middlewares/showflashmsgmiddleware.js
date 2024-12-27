

function showFlashMsg(req,res,next){
    try {
        let flashmsg = req.cookies.flashmsg || null
    res.locals.errmsg = req.cookies.flasherr || null;
    res.locals.msg = flashmsg
    if (flashmsg) {
        res.clearCookie("flashmsg")
    }
    if (req.cookies.flasherr) {
        res.clearCookie("flasherr")
    }
    next()
    } catch (err) {
        next(err)
    }
}

module.exports = showFlashMsg