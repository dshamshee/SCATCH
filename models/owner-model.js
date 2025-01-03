const mongoose = require('mongoose');


const ownerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    picture: String,
    phone: Number,
    city: String,
    state: String,
    gstin: String
});

module.exports = mongoose.model('owner', ownerSchema);