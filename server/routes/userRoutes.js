const express = require('express');
const router = express.Router();

const { 
    syncUserStats, 
    updateUserProfile, 
    getProjectById, 
    searchUsers, 
    followUser, 
    unfollowUser,
    acceptFollowRequest,
    rejectFollowRequest
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public route to fetch project details
router.get('/:userId/projects/:projectId', getProjectById);

// Social & Search
router.get('/search', searchUsers); 
router.put('/:id/follow', protect, followUser);
router.put('/:id/unfollow', protect, unfollowUser); // Functions as cancel if request
router.put('/:id/accept', protect, acceptFollowRequest);
router.put('/:id/reject', protect, rejectFollowRequest);

router.post('/sync-stats', protect, syncUserStats);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
