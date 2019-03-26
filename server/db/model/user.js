const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true,
        trim:true
    },
    username:{
        type:String,
        unique:true,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;