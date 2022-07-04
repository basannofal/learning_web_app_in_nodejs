const mongoose = require("mongoose");

const adminschema = mongoose.Schema({
    heading:String,
    discription:String,
    
    image :[Object],
  
    vedio: [Object],
    sam : [{
        head  : String ,
        disc : String,
        vedio : String
    }]
    
});


const shareschema = mongoose.model("admindata", adminschema);

module.exports = shareschema;