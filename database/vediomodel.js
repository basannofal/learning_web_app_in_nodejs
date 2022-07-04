const mongoose = require("mongoose");

const adminvedioschema = mongoose.Schema({
   
   vedio:[Object]
});


const sharevedioschema = mongoose.model("adminvediodata", adminvedioschema);

module.exports = sharevedioschema;