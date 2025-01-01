const express = require('express');
const router = express.Router();
const isloggedin = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model')


router.get('/', function(req, res){
    let error = req.flash("error");
    res.render('index', {error});
})

router.get('/shop', isloggedin,async function(req, res){
    let products = await productModel.find()

    res.render("shop", {products});
})

router.get('/logout', isloggedin, function(req, res){
    res.render("shop");
})

module.exports = router;