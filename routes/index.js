const express = require('express');
const router = express.Router();
const isloggedin = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const ownerModel = require('../models/owner-model');


router.get('/', function(req, res){
    let error = req.flash("error");
    res.render('index', {error, loggedin: false});
})

router.get('/shop', isloggedin,async function(req, res){
    let products = await productModel.find()
    let success = req.flash("success");
    res.render("shop", {products, success});
})


router.get('/cart', isloggedin,async function(req, res){
    let user = await userModel.findOne({email: req.user.email}).populate('cart');
    let totalAmount = 0
     user.cart.map(item => {
     totalAmount += (item.price-item.discount);
    });
    // const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount);
    res.render("cart", {user, totalAmount});
})


router.get('/removeitem/:id', isloggedin, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.splice(user.cart.indexOf(req.params.id), 1);
    await user.save();
    res.redirect("/cart");
})

router.get('/addtocart/:productid', isloggedin,async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
     await user.save();
     req.flash("success", "Added to cart");
     res.redirect('/shop');
})

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
        res.redirect(`/owner/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    } else {
        res.send("Email or Password Incorrect");
    }
});


module.exports = router;