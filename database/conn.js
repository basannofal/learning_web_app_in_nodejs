const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config();

const db = process.env.DATABASE
// const olddb = "mongodb://localhost:27017/learningapp"


mongoose.connect(db).then( () => {
    console.log("connected");

}).catch((err) => {
    console.log(err);
})