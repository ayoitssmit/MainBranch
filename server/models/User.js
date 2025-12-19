const mongoose = require('mongoose');

const ProfileSectionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['github', 'leetcode', 'kaggle', 'huggingface', 'projects', 'certifications', 'skills', 'about']
    },
    order: {
        type: Number,
        required: true
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    githubId: {
        type: String,
        unique: true,
        sparse: true 
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    displayName: String,
    avatarUrl: String,
    bio: String,
    title: String,
    location: String,
    website: String,
    socials: {
        twitter: String,
        linkedin: String,
        youtube: String,
        kaggle: String,
        huggingface: String,
        blog: String
    },
    skills: [String],
    profileSections: [ProfileSectionSchema],
    accessToken: String, 
    lastSynced: Date,
    password: {
        type: String,
        select: false 
    },
    authProvider: {
        type: String,
        enum: ['github', 'email'],
        default: 'github'
    },
    stats: {
        github: {
            followers: { type: Number, default: 0 },
            following: { type: Number, default: 0 },
            public_repos: { type: Number, default: 0 },
            total_stars: { type: Number, default: 0 },
            languages: { type: Map, of: Number },
            last_synced: Date
        },
        leetcode: {
            username: String,
            ranking: { type: Number, default: 0 },
            total_solved: { type: Number, default: 0 },
            easy_solved: { type: Number, default: 0 },
            medium_solved: { type: Number, default: 0 },
            hard_solved: { type: Number, default: 0 },
            last_synced: Date
        },
        kaggle: {
            username: String,
            ranking: String,
            competitions_medals: { type: Number, default: 0 },
            datasets_medals: { type: Number, default: 0 },
            notebooks_medals: { type: Number, default: 0 },
            last_synced: Date
        },
        huggingface: {
            username: String,
            likes: { type: Number, default: 0 },
            models: { type: Number, default: 0 },
            datasets: { type: Number, default: 0 },
            last_synced: Date
        }
    },
    skills: [{
        type: String,
        trim: true
    }],
    projects: [{
        title: { type: String, required: true },
        description: String,
        link: String,
        tags: [String],
        image: String
    }],
    certificates: [{
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: Date,
        link: String
    }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

UserSchema.pre('save', async function() {
    if (this.isNew && this.profileSections.length === 0) {
        this.profileSections = [
            { type: 'about', order: 0, isVisible: true },
            { type: 'skills', order: 1, isVisible: true },
            { type: 'github', order: 2, isVisible: true },
            { type: 'projects', order: 3, isVisible: true }
        ];
    }
});

module.exports = mongoose.model('User', UserSchema);
