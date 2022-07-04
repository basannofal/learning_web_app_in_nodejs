const getSchema = require("../database/model");


const isadminlogin = async (req,res,next) => {
    try {
        
       if(req.session.user_id){}
       else{
           res.redirect('admin-login');
       }
        
        next();
    } catch (err) {
        console.log(err);
    }
}



const isadminlogout = async (req,res,next) => {
    try {
        
       if(req.session.user_id){
           res.redirect('admin-wellcome');
       }
       
      
        
        next();
    } catch (err) {
        console.log(err);
    }
}











const islogin = async (req,res,next) => {
    try {
        
       if(req.session.user_id){}
       else{
           res.redirect('user-lg-form');
       }
        
        next();
    } catch (err) {
        console.log(err);
    }
}



const islogout = async (req,res,next) => {
    try {
        
       if(req.session.user_id){
           res.redirect('user-welcome');
       }
       
      
        
        next();
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    islogin,
    islogout,
    isadminlogin,
    isadminlogout,
};