import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role : {
        type : String,
        enum : ["user", "assistant"],
        required : true
    },
    timestamp : {
        type : Date,
        default : Date.now
    },
    content : {
        type : String,
        required : true
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    messages : [MessageSchema],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
});

export default mongoose.model("Thread", ThreadSchema);