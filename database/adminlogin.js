const mongoose = require("mongoose");

const admindata = mongoose.Schema({
   
    userid : String,
    password : String,

});


const shareadminlogindata = mongoose.model("adminlogindat", admindata);

module.exports = shareadminlogindata;