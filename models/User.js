// const mongoose= require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

// userSchema.plugin(passportLocalMongoose);

import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    }
})

export default mongoose.model("User", userSchema);
