const express = require('express');
const router = express.Router();
const isloggedin = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const ownerModel = require('../models/owner-model');
const jwt = require('jsonwebtoken');


router.get('/', async function(req, res){
    if(!req.cookies.token){
        let error = req.flash("error");
       return res.render('index', {error, loggedin: false});
    }
    
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        // console.log(decoded.email);
        let user = await userModel.findOne({email: decoded.email});
        let owner = await ownerModel.findOne({email: decoded.email});
        if(owner) return res.render('admin')
        else res.redirect('/shop');
    } catch (error) {
        console.log(error);
    }
})

// Display the shpt page for user (if usere loggedin)
router.get('/shop', isloggedin,async function(req, res){
    let products = await productModel.find()
    let success = req.flash("success");
    res.render("shop", {products, success});
})


// Display the User cart products page 
router.get('/cart', isloggedin,async function(req, res){
    let user = await userModel.findOne({email: req.user.email}).populate('cart');
    let totalAmount = 0
     user.cart.map(item => {
     totalAmount += (item.price-item.discount);
    });
    // const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount);
    res.render("cart", {user, totalAmount});
})


// Remove products from cart if user didn't want to order 
router.get('/removeitem/:id', isloggedin, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.splice(user.cart.indexOf(req.params.id), 1);
    await user.save();
    res.redirect("/cart");
})

// Addd product items to the user cart 
router.get('/addtocart/:productid', isloggedin, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
     await user.save();
     req.flash("success", "Added to cart");
     res.redirect('/shop');
})


// Accept the details from the index page and check who's come (Owner or User) and redirect to respective routes
router.post('/login', async function (req, res) {
    let { email, password } = req.body;
    let owner = await ownerModel.findOne({ email: email });
    let user = await userModel.findOne({ email: email });

    if (user) {
        console.log("User found in index");
        // Securely pass email and password using query parameters (not recommended for production)
        res.redirect(`/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    } else if (owner) {
        console.log("Owner found in index");
        // Securely pass email and password using query parameters (not recommended for production)
        res.redirect(`/owners/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    } else {
        res.send("Email or Password Incorrect");
    }
});





module.exports = router;