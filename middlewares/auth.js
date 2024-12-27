const jwt = require('jsonwebtoken');
require('dotenv').config();

async function Auth(req, res, next) {
    try {
        let { loginToken } = req.cookies;
        if (!loginToken) {
            // return res.status(401).json({ message: "Token is missing Please login." });
            return res
            .cookie("redirectTo",req.originalUrl)
            .redirect('/api/auth/login');
        }
        let decodedData;
        try {
            decodedData = jwt.verify(loginToken, process.env.JWT);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token Please login again." });
        }
        if (!decodedData) {
            return res
            .cookie("redirectTo",req.originalUrl)
            .status(401).redirect("/api/auth/login")
        }
        req.userInfo = decodedData;  
        next(); 
    } catch (err) {
        next(err); 
    }
}

module.exports = { Auth };
