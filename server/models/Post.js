const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: 'Untitled'
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentsCount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Auto-generate slug if not provided
PostSchema.pre('save', function() {
    if (!this.slug) {
        // Fallback slug generation
        this.slug = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }
});

module.exports = mongoose.model('Post', PostSchema);
