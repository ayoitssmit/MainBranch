const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, { timestamps: true });

// Ensure unique conversation for same pair of participants? 
// For now, we will handle uniqueness in the controller logic (finding existing conversation).

module.exports = mongoose.model('Conversation', conversationSchema);
