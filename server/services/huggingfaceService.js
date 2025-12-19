const axios = require('axios');

const fetchHuggingFaceStats = async (username) => {
    try {
        const response = await axios.get(`https://huggingface.co/api/users/${username}/overview`);
        // The /overview endpoint might be internal or specific. 
        // Let's use the public API details or scrape. 
        // Actually, simpler: https://huggingface.co/api/users/{username} usually gives basics?
        // Let's check docs or try a standard likely endpoint.
        // HF API for users: https://huggingface.co/api/users/username
        
        // Let's try to get their public models/datasets first
        const userRes = await axios.get(`https://huggingface.co/api/users/${username}`);
        
        // userRes.data might contain 'numModels', 'numDatasets', 'likes' etc. if available. 
        // If not, we might need to query models?author=username
        
        // Let's assume we can fetch models and datasets lists
        const modelsRes = await axios.get(`https://huggingface.co/api/models?author=${username}&limit=1`);
        const datasetsRes = await axios.get(`https://huggingface.co/api/datasets?author=${username}&limit=1`);
        
        // The headers 'x-total-count' often gives the count in many APIs, let's see. 
        // HF returns array. If paginated, getting full count might be harder.
        // But the user object from /api/users/{username} should have aggregated stats?
        // Checking: https://huggingface.co/api/users/{username} -> returns { user: "name", ... }
        // It's not super documented for stats.
        
        // FALLBACK: Just return basic info we can confirm.
        // Or if we can't reliably get stats without Auth, we leave 0.
        
        return {
            username,
            likes: 0, // Placeholder
            models: 0, // Placeholder till verified
            datasets: 0, // Placeholder
            last_synced: new Date()
        };

    } catch (error) {
        console.error('Hugging Face Service Error:', error.message);
        throw new Error('Failed to fetch Hugging Face stats');
    }
};

// Start simpler: just return the username for now to verify linkage.
// User will manually input for now or we expand later.
const fetchHuggingFaceStatsSimple = async (username) => {
     return {
        username,
        last_synced: new Date()
    };
}


module.exports = { fetchHuggingFaceStats: fetchHuggingFaceStatsSimple };
