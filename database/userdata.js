const mongoose = require("mongoose");

const userdata = mongoose.Schema({
   
    firstname : String,
    lastname : String,
    email : {
        type :String,
        unique : true,
        require :true,
    },
    mobilenumber : Number,
    password : String

});


const shareuserdata = mongoose.model("userdata", userdata);

module.exports = shareuserdata;