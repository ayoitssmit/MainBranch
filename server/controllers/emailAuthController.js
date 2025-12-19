const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    console.log('Register request received:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Calculate default profile sections
        const defaultProfileSections = [
             { type: 'about', order: 0, isVisible: true },
             { type: 'skills', order: 1, isVisible: true },
             { type: 'projects', order: 2, isVisible: true }
        ];

        // Create user (githubId is required by schema, we need to handle this)
        // Wait, githubId is required unique. For email users, we need a placeholder or make it not required.
        // Let's modify schema to Sparse Unique or not required if authProvider is email.
        // For now, generate a fake githubId for email users to satisfy schema or fix schema.
        // Better fix schema. For now, let's use a UUID or "email_timestamp".
        const fakeGithubId = `email_${Date.now()}`;

        const user = await User.create({
            githubId: fakeGithubId, // temporary hack until schema migration
            username,
            email,
            password: hashedPassword,
            displayName: username,
            authProvider: 'email',
            profileSections: defaultProfileSections
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
             res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { registerUser, loginUser };
