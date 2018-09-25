'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name :  {type: String, default: "User"},
    pass :  {type: String, default: "root"},
    perm :  {type: String, default: "root"},
});

module.exports = mongoose.model('UsersD', UserSchema);