'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    picture : String,
    model : String,
    serial : String,
    type : String,
    brand :String,
    comment : String,
    price : String,
    date : String
});

module.exports = mongoose.model('Product', ProductSchema);