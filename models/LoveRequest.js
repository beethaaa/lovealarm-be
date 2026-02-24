const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoveRequestSchema = new Schema(
    {
        fromUserId:{
            type : Schema.Types.ObjectId,
            ref: 'User',
        },
        toUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            default: 'PENDING',
        }
    },
    { timestamps : true},
)

module.exports = mongoose.model('LoveRequest',LoveRequestSchema)