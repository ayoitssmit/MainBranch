const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('../models/Post');
const Comment = require('../models/Comment');
// const User = require('../models/User'); // Optional: keep users for convenience

const resetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Post.deleteMany({});
        console.log('Deleted all Posts');

        await Comment.deleteMany({});
        console.log('Deleted all Comments');
        
        // await User.deleteMany({});
        // console.log('Deleted all Users');

        console.log('Database reset complete');
        process.exit(0);
    } catch (error) {
        console.error('Reset failed:', error);
        process.exit(1);
    }
};

resetDb();
