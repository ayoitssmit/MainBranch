const User = require('../models/User');
const { fetchGitHubStats } = require('../services/githubService');
const { fetchLeetCodeStats } = require('../services/leetcodeService');
const { fetchHuggingFaceStats } = require('../services/huggingfaceService');
const axios = require('axios');

// @desc    Sync user stats
// @route   POST /api/users/sync-stats
// @access  Private
const syncUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+accessToken'); 
        
        const updates = {};
        let statsUpdated = false;

        // 1. Sync LeetCode
        if (req.body.leetcodeUsername || user.stats?.leetcode?.username) {
            try {
                const username = req.body.leetcodeUsername || user.stats.leetcode.username;
                const lcStats = await fetchLeetCodeStats(username);
                updates['stats.leetcode'] = lcStats;
                statsUpdated = true;
            } catch (error) {
                console.error('LeetCode sync failed:', error.message);
            }
        }

        // 2. Sync GitHub
        // 2a. Public Basic
        if ((user.authProvider === 'github' || user.githubId || user.username)) {
             try {
                if (!req.body.githubAccessToken && !user.accessToken) {
                    const targetUser = user.githubId || user.username; 
                    const ghRes = await axios.get(`https://api.github.com/users/${targetUser}`); 
                    const { followers, following, public_repos } = ghRes.data;
                    
                    updates['stats.github'] = {
                        ...(user.stats?.github || {}),
                        followers,
                        following,
                        public_repos,
                        last_synced: new Date()
                    };
                    statsUpdated = true;
                }
             } catch (e) { }
        }
        
        // 2b. Deep Sync (GitHub)
        if (req.body.githubAccessToken || user.accessToken) {
             try {
                const token = req.body.githubAccessToken || user.accessToken;
                console.log('Attempting GitHub Deep Sync...');
                const ghStats = await fetchGitHubStats(token);
                
                updates['stats.github'] = {
                    ...ghStats,
                    last_synced: new Date()
                };
                
                if (req.body.githubAccessToken) {
                    updates['accessToken'] = req.body.githubAccessToken;
                }
                statsUpdated = true;
            } catch (e) {
                 console.error('GitHub Deep Sync Failed:', e.message);
             }
        }

        // 3. Sync HuggingFace
        if (req.body.huggingfaceUsername || user.stats?.huggingface?.username) {
            try {
                const hfUsername = req.body.huggingfaceUsername || user.stats.huggingface.username;
                const hfStats = await fetchHuggingFaceStats(hfUsername);
                
                updates['stats.huggingface'] = hfStats;
                statsUpdated = true;
            } catch (error) {
                 console.error('HuggingFace sync failed:', error.message);
            }
        }

        if (Object.keys(updates).length > 0) {
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $set: updates },
                { new: true }
            );
            return res.json(updatedUser);
        } else {
             return res.json(user); // No updates made
        }

    } catch (error) {
        console.error('Sync Stats Error:', error);
        res.status(500).json({ message: 'Failed to sync stats' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Basic Fields
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.displayName = req.body.displayName || user.displayName;
            if (req.body.skills) user.skills = req.body.skills;
            
            // LeetCode Username
            if (req.body.leetcodeUsername) {
                if (!user.stats) user.stats = {};
                if (!user.stats.leetcode) user.stats.leetcode = {};
                user.stats.leetcode.username = req.body.leetcodeUsername;
            }

             // Kaggle
             if (req.body.kaggleUsername) {
                if (!user.stats) user.stats = {};
                if (!user.stats.kaggle) user.stats.kaggle = {};
                user.stats.kaggle.username = req.body.kaggleUsername;
                if (!user.socials) user.socials = {};
                user.socials.kaggle = `https://kaggle.com/${req.body.kaggleUsername}`;
           }

           // HuggingFace
           if (req.body.huggingfaceUsername) {
                if (!user.stats) user.stats = {};
                if (!user.stats.huggingface) user.stats.huggingface = {};
                user.stats.huggingface.username = req.body.huggingfaceUsername;
                if (!user.socials) user.socials = {};
                user.socials.huggingface = `https://huggingface.co/${req.body.huggingfaceUsername}`;
           }

           // Socials
           if (req.body.blogUrl) {
               if (!user.socials) user.socials = {};
               user.socials.blog = req.body.blogUrl;
           }

           // Projects & Certificates
           if (req.body.projects) {
               user.projects = req.body.projects;
           }
           if (req.body.certificates) {
               user.certificates = req.body.certificates;
           }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

// @desc    Get project by ID
// @route   GET /api/users/:userId/projects/:projectId
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const { userId, projectId } = req.params;
        const user = await User.findById(userId);
        
        if (!user || !user.projects) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const project = user.projects.id(projectId);
        
        if (!project) {
             return res.status(404).json({ message: 'Project not found' });
        }

        // Return user minimal info + project
        res.json({
            author: {
                _id: user._id,
                displayName: user.displayName,
                username: user.username,
                avatarUrl: user.avatarUrl
            },
            project
        });

    } catch (error) {
        console.error('Get Project Error:', error);
        res.status(500).json({ message: 'Server error retrieving project' });
    }
}

// Search Users
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Query is required" });

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { displayName: { $regex: query, $options: 'i' } },
                { 'skills': { $regex: query, $options: 'i' } } 
            ]
        }).select('username displayName avatarUrl headline skills followers following followRequests');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Follow User (Send Request)
const followUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) return res.status(404).json({ message: "User not found" });

        // Check if already following
        if (userToFollow.followers.includes(req.user.id)) {
            return res.status(400).json({ message: "You already follow this user" });
        }

        // Check if already requested
        if (userToFollow.followRequests && userToFollow.followRequests.includes(req.user.id)) {
            return res.status(400).json({ message: "Follow request already sent" });
        }

        // Send Request
        await userToFollow.updateOne({ $push: { followRequests: req.user.id } });
        res.json({ message: "Follow request sent", status: 'requested' });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Unfollow User / Cancel Request
const unfollowUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow) return res.status(404).json({ message: "User not found" });

        if (userToUnfollow.followers.includes(req.user.id)) {
            // Unfollow
            await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.json({ message: "User unfollowed", status: 'none' });
        } else if (userToUnfollow.followRequests && userToUnfollow.followRequests.includes(req.user.id)) {
            // Cancel Request
            await userToUnfollow.updateOne({ $pull: { followRequests: req.user.id } });
            res.json({ message: "Follow request canceled", status: 'none' });
        } else {
            res.status(400).json({ message: "You are not following or requesting this user" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Accept Follow Request
const acceptFollowRequest = async (req, res) => {
    try {
        const requesterId = req.params.id; // User who sent the request
        const currentUser = await User.findById(req.user.id);
        const requester = await User.findById(requesterId);

        if (!currentUser || !requester) return res.status(404).json({ message: "User not found" });

        if (!currentUser.followRequests.includes(requesterId)) {
            return res.status(400).json({ message: "No follow request from this user" });
        }

        // Move from requests to followers
        await currentUser.updateOne({ 
            $pull: { followRequests: requesterId },
            $push: { followers: requesterId }
        });

        // Add to requester's following
        await requester.updateOne({ $push: { following: req.user.id } });

        res.json({ message: "Follow request accepted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Reject Follow Request
const rejectFollowRequest = async (req, res) => {
    try {
        const requesterId = req.params.id;
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) return res.status(404).json({ message: "User not found" });

        if (!currentUser.followRequests.includes(requesterId)) {
            return res.status(400).json({ message: "No follow request from this user" });
        }

        await currentUser.updateOne({ $pull: { followRequests: requesterId } });
        res.json({ message: "Follow request rejected" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { 
    syncUserStats, 
    updateUserProfile, 
    getProjectById, 
    searchUsers, 
    followUser, 
    unfollowUser,
    acceptFollowRequest,
    rejectFollowRequest
};
