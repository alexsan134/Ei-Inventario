'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    picture :  {type: String, default: ""},
    model :  {type: String, default: ""},
    serial :  {type: String, default: ""},
    type :  {type: String, default: ""},
    brand : {type: String, default: ""},
    comment : {type: String, default: "No hay comentario"} ,
    price :  {type: String, default: "0Q"},
    date :  {type: String, default: ""}
});

module.exports = mongoose.model('Product', ProductSchema);