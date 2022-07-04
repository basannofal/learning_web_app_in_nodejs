const express = require("express");
const app = express();
const path = require('path');
const ejs = require("ejs");
const axios = require("axios");
const multer = require("multer");
const bodyparser = require("body-parser");
const session = require('express-session');
const port = process.env.PORT || 3000;


app.use(session({secret:"thisissessionsecretcodeblock"}))


app.use(express.json());
app.use(express.static(__dirname+'/uploads'));
app.use(express.static(__dirname+'/photos'));
app.use(express.static(__dirname));


require("./database/conn");
const getvedioschem = require('./database/vediomodel');
const getSchema = require("./database/model");
const getuserdata = require('./database/userdata');
const getadminlogin = require('./database/adminlogin');
const auth = require("./intermediate/auth");

//body parsedr
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


// set view engine
app.set("view engine", "ejs");
// storage
const Storage = multer.diskStorage({
    destination:"uploads",
    filename:(req, file, cb) => {
        cb(null, file.fieldname  + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage:Storage
});

// const vediostorage = multer.diskStorage({
//     destination:"vedio",
//     filename:(req, file, cb) => {
//         cb(null, file.fieldname  + Date.now() + path.extname(file.originalname));
//     },
// });

// const vedioupload = multer({
//     storage:vediostorage
// });






app.get("/", (req, res) => {
    res.render("home")
});


app.get("/admin-wellcome",auth.isadminlogin, (req, res) => {
    axios.get('https://learning-web-app.herokuapp.com/adminapi')
    .then(function(response) {
        console.log(response);
        res.render('admin-wellcome', {user:response.data});
    }).catch(err => {
        res.send(err);
    })
});



app.post("/admin-login", async (req, res) => {
    try {
        
    
    const userid = req.body.userid;
    const password = req.body.pass;

    

    const adminlogindata = await getadminlogin.findOne({userid : userid})
        console.log( adminlogindata);

    if (adminlogindata.password === password ) {
        req.session.user_id = adminlogindata._id ; 
        res.redirect("admin-wellcome");
    }
    else {
        res.send("invalid password or userid");
    }

} catch (error) {
    console.log(error);
        res.send('invalid user id')
}

});

app.get("/admin-login", (req, res) => {
    res.render("admin-login");


});



app.get("/admin-form", (req, res) => {
    res.render("admin-form");
    

});



app.get("/admin-update", (req, res) => {
    axios.get('https://learning-web-app.herokuapp.com/adminapi', { params : { id : req.query.id }})
    .then(function(userd){
        res.render("admin-update", { us : userd.data})
        
    })
    .catch(err =>{
        res.send(err);
    })

});


app.get("/admin-corse", auth.isadminlogin, (req,res) => {
    axios.get('https://learning-web-app.herokuapp.com/adminapi', { params : { id : req.query.id }})
    .then(function(userdata){
        res.render("admin-corse", { use : userdata.data})
    })
    .catch(err =>{
        res.send(err);
    })
})


app.get("/admin-corse-update", (req, res) => {
    axios.get('https://learning-web-app.herokuapp.com/adminapi', { params : { id : req.query.id }})
    .then(function(userd){
        res.render("admin-videoupload", { u : userd.data})
        
    })
    .catch(err =>{
        res.send(err);
    })

});


















// admin api data 

app.post("/adminapi" ,upload.single('image'), (req, res) => {

    
            // const getdata =  getSchema({
            //     heading: req.body.heading,
            //     discription: req.body.discription,
            //     image : req.file.filename,
            
            //     vedio:req.file.vedioname,
        
            // });
        
            // getdata.save(getdata).then(data => {
            //     res.redirect("admin-wellcome");
            // }).catch((err) => {
            //     res.send(err)
            // });

            
//******************************* you can change only commented code and upload.array('vedio')
// and change data base value
            
   try {
//     let filesarray = [];
//     req.files.forEach(element => {
//         const filess = {
//             filename : element.originalname,
//             filePath : element.path,
//             fileType : element.mimetype
//         }
//         filesarray.push(filess);
//     });


    const getdata = new getSchema({
        heading: req.body.heading,
        discription: req.body.discription,
        image: req.file.filename,
        
        // vedio : filesarray,
    
        // vedio:req.file.filename

    });   
     getdata.save(getdata).then(data => {
            res.redirect("admin-wellcome");
        }).catch((err) => {
            res.send(err)
        });

} catch (err) {
   console.log(err);
}
            
           
   
   

});




app.get("/adminapi", (req, res) => {

    if (req.query.id) {
        const id = req.query.id;
        getSchema.findById(id).then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
    } else {
        getSchema.find().then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err);
        });
    }

    

});





app.get("/admin-wellcome/delete/:id", (req,res) => {
    
        const id = req.params.id;
        console.log(id);
        getSchema.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.send("please enter valid id")
            } else {
                res.redirect("/admin-wellcome")
            }
        }).catch(err => {
            res.send(err);
        })
       
} )



app.post('/admin-wellcome/update/', upload.single('image'), (req,res) => {
    if(!req.body){
        return res
        .send('bismillahir rahmani rahim');
    }
    
    const id = req.body.id;
    getSchema.findByIdAndUpdate(id, {
        $set:{
            
                heading: req.body.heading,
                discription: req.body.discription,
                
                
                    image: req.file.filename,
        
                
            
                // vedio:req.file.filename
        }

    })
    .then(data => {
        if (!data) {
            res.send("please enter valid id")
        } else {
            res.send("updated succesfully")
        }
    }).catch(err => {
        res.send(err);
    })
})





app.get('/admin-corse/delete/:id/:objectid', async (req,res) => {

    const id = req.params.id;
        console.log(id);
    const objectid = req.params.objectid
    console.log(objectid);
        
        const idst = id.toString();
        const dbby = await getSchema.find({_id: objectid})
        console.log(dbby);
       
        getSchema.findByIdAndUpdate(dbby, {
            
            $pull:{
                sam : {

                    "_id": idst
                    
                }
                    
                   
                }
        
            })
            .then(data => {
                if (!data) {
                    
                    res.send("please enter valid id")
                } else {
                    res.send("Succesfully Video Deleted")
                }
            }).catch(err => {
                res.send(err);
              
            })
})


app.post('/admin-corse_update/:id', upload.single('vedio'), (req,res) => {

    const id = req.params.id;
    console.log(id);
    // const db = new getSchema({
    //     head : req.body.head
    // })

    // const gg = new getSchema({
    //     head : req.body.head
    // })
    // gg.save(gg);
    getSchema.findByIdAndUpdate(id, {
    $push:{
            sam : 
                {
                    head : req.body.head,
                    disc : req.body.disc,
                    vedio : req.file.filename
                },
           
        }

    })
    .then(data => {
        if (!data) {
            res.send("please enter valid id")
        } else {
            res.redirect('/admin-wellcome',)
        }
    }).catch(err => {
        res.send(err);
    })
})




// users data api


















// *********************************** user part ****************************************

app.get("/user-rg-form", auth.islogout, (req, res) => {
    res.render("user-rg-form");
    
});


app.get("/user-lg-form", auth.islogout, (req, res) => {
    res.render("user-lg-form");
    
});


app.get("/user-welcome", auth.islogin,(req, res) => {
    axios.get('https://learning-web-app.herokuapp.com/adminapi')
    .then(function(response) {
        
        res.render('user-welcome', {uw:response.data});
    }).catch(err => {
        res.send(err);
    })
    
});


app.get("/user-corse", auth.islogin,(req,res) => {
    axios.get('https://learning-web-app.herokuapp.com/adminapi', { params : { id : req.query.id }})
    .then(function(userdata){
        res.render("user-corse", { uc : userdata.data})
    })
    .catch(err =>{
        res.send(err);
    })
})



app.post("/userdataapi",  async (req, res) => {

    
    try {
        
         const userdata = new getuserdata({
            
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            mobilenumber : req.body.mobilenumber,
            password :req.body.password,
     
         });   
         await userdata.save();
         res.redirect("user-lg-form");
 
    } catch (err) {
        console.log(err);
    }
 
     // getvediodata.save(getvediodata).then(data => {
     //     res.redirect("admin-wellcome");
     // }).catch((err) => {
     //     res.send(err)
     // });
  
 });


 


app.get("/userdataapi", (req, res) => {

    if (req.query.id) {
        const id = req.query.id;
        getuserdata.findById(id).then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
    } else {
        getuserdata.find().then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err);
        });
    }

    

});

app.post("/login",  async (req, res) => {

    
    try {
        
            const email = req.body.email;
            const password = req.body.password;
     
            const userdetail = await getuserdata.findOne({email:email});

            if(userdetail.password === password)
            {
                    req.session.user_id = userdetail._id ; 
                    res.redirect("user-welcome");
            }else{
                res.send("login detail is in correct");
            }
 
    } catch (err) {
        res.send('envalid email')
    }
 
     // getvediodata.save(getvediodata).then(data => {
     //     res.redirect("admin-wellcome");
     // }).catch((err) => {
     //     res.send(err)
     // });
  
 });

 














app.listen(port, () => {
    console.log("server ready");
})









// app.put('/admin-update/:id', (req,res) => {
//     const id = req.params.id;
//     getSchema.findByIdAndUpdate({id}, {
//         $set:{
            
//                 heading: req.body.heading,
//                 discription: req.body.discription,
//                 $push : {

//                     image: req.file.filename,
//                 }
            
//                 // vedio:req.file.filename
//         }

//     }).then(result => {
//         res.status(200).json({
//             updated_data : result
//         })
//     }).catch(err => {
//         console.log(err);
//     })
// })







// app.post("/adminapi", (req, res) => {

//     const getdata = getSchema({
//         heading: req.body.heading,
//         discription: req.body.discription,


//     });

//     getdata.save(getdata).then(data => {
//         res.redirect("admin-wellcome");
//     }).catch((err) => {
//         res.send(err)
//     });


// });













// app.delete('/adminapi/:id', (req,res) => {
    
   
        
//         const id = req.params.id;
//         console.log(id);
//         getSchema.findByIdAndDelete(id)
//         .then(data => {
//             if (!data) {
//                 res.send("please enter valid id")
//             } else {
//                 res.send(data)
//             }
//         }).catch(err => {
//             res.send(err);
//         })
       

    
// })










// app.post('/update/', upload.single('image'), (req,res) => {
//     if(!req.body){
//         return res
//         .send('bismillahir rahmani rahim');
//     }
    
//     const id = req.body.id;
//     getSchema.findByIdAndUpdate(id, {
//         $set:{
            
//                 heading: req.body.heading,
//                 discription: req.body.discription,
                

//                     image: req.file.filename,
                
            
//                 // vedio:req.file.filename
//         }

//     })
//     .then(data => {
//         if (!data) {
//             res.send("please enter valid id")
//         } else {
//             res.redirect('admin-wellcome')
//         }
//     }).catch(err => {
//         res.send(err);
//     })
// })
