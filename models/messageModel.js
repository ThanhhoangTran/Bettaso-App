const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;