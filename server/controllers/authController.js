const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Auth with GitHub
// @route   POST /api/auth/github
// @access  Public
const githubAuth = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Code is required' });
    }

    try {
        // 1. Exchange code for access token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: { Accept: 'application/json' }
        });

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            return res.status(400).json({ message: 'Invalid code or GitHub error' });
        }

        // 2. Get user profile from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const githubUser = userResponse.data;
        const { id, login, avatar_url, name, bio, email, blog, location, twitter_username } = githubUser;

        // 3. Find or Create User
        let user = await User.findOne({ githubId: id.toString() });

        if (user) {
            // Update token
            user.accessToken = access_token;
            // Update basic info if changed (optional, maybe configurable)
            user.avatarUrl = avatar_url;
            await user.save();
        } else {
            user = await User.create({
                githubId: id.toString(),
                username: login,
                email: email || `${login}@no-email.github.com`, // Handle missing email
                displayName: name || login,
                avatarUrl: avatar_url,
                bio: bio,
                location: location,
                website: blog,
                socials: {
                    twitter: twitter_username,
                    linkedin: '',
                    youtube: ''
                },
                accessToken: access_token
            });
        }

        // 4. Generate JWT
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
            token
        });

    } catch (error) {
        console.error('GitHub Auth Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // Re-fetch user to ensure populated fields
    const user = await User.findById(req.user._id)
        .populate('followRequests', 'username displayName avatarUrl headline');
        
    res.status(200).json(user);
};

module.exports = { githubAuth, getMe };
