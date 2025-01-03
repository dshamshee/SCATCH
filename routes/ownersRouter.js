const express = require('express');
const router = express.Router(); 
const ownerModel = require('../models/owner-model');
const productModel = require('../models/product-model');
const { generateToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');


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
      let {fullname, email, password, picture, phone, city, state, gstin} = req.body;
      
       let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
            picture,
            phone,
            city,
            state,
            gstin
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


// Owner create products (yahi rout pahle /admin tha isko change kiye h hm)
router.get('/create/products', function(req, res){
  let success = req.flash("Successs");
  res.render("createproducts", {success, Showcart: false}); // success is temporary isko dekh lena 
})


router.get('/login',async function(req, res){
  let {email, password} = req.query;
  let owner = await ownerModel.findOne({email: email});
  let products = await productModel.find();
  if(owner){
    let token = generateToken(owner);
    res.cookie("token", token);
    let success = req.flash("success");
    res.render('admin', {products, success, Showcart: false});
  }
})



router.get('/showallproducts', async function(req, res){
  let products = await productModel.find();
  let success = req.flash("success");
  res.render('admin', {products, success, Showcart: false});
})


router.get('/deleteproduct/:productsid', async function(req, res){
  let product = await productModel.deleteOne({_id: req.params.productsid});
  res.redirect('/owners/showallproducts');
})


router.get('/profile',async function(req, res){
  let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
  let owner = await ownerModel.findOne({email: decoded.email});
  // console.log(owner.fullname);
  res.render('owner-profile', {owner, Showcart: false});
})

module.exports = router;