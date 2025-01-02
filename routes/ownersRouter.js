const express = require('express');
const router = express.Router(); 
const ownerModel = require('../models/owner-model');


// These routes are only work when the project on development mode
if(process.env.NODE_ENV === "development"){ // It checks if the project is in development mode or Production mode
    router.post('/create', async function(req, res){
      // console.log("Under development");
      try {
        // It checks if any one Owner is already exist then don't create another Owner 
      let owners = await  ownerModel.find();
      if(owners.length > 0){
        return res
        .status(500)
        .send("You don't have permission to create a new owner");
      }

      // If no any Owner is exist then create a new Owner
      let {fullname, email, password} = req.body;
      
       let createdOwner = await ownerModel.create({
            fullname,
            email,
            password
        })
        // console.log("Owner created successfully");
        res.status(201).send(createdOwner); 
      } catch (err) {
        console.log(err.message());
        // console.log("not created");
      }
      
    })
}

// _______________________________________________________________



router.get('/admin', function(req, res){
  let success = req.flash("Successs");
  res.render("createproducts", {success}); // success is temporary isko dekh lena 
})




module.exports = router;