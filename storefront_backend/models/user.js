const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String,required: true, unique: true},
    phoneNumber: {type: String,required: true,unique:true},
    password: {type: String,required: true},
    cart: {type:Array,default:[]},
    orders:{type:Array,default:[]}
});

module.exports = mongoose.model("User",userSchema);