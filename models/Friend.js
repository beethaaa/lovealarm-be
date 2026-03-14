const mongoose = require("mongoose")

const FriendSchema = new mongoose.Schema({
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    friendId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    note:String,

},{
    timestamps:{
        createdAt: true,
        updatedAt: false,
    }
})

module.exports = mongoose.model("Friend",FriendSchema);