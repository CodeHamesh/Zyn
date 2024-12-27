require('dotenv').config()

const mongoose = require('mongoose');
async function connectMongodb() {
    await mongoose.connect(`${process.env.MONGO}`)
}
module.exports = connectMongodb

