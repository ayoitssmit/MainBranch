const axios = require('axios');

const fetchLeetCodeStats = async (username) => {
    try {
        // LeetCode GraphQL Query
        const query = `
            query userProblemsSolved($username: String!) {
                allQuestionsCount { difficulty count }
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum { difficulty count }
                    }
                    profile { ranking }
                }
            }
        `;

        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });

        const data = response.data.data;
        if (!data.matchedUser) {
            throw new Error('LeetCode user not found');
        }

        const stats = data.matchedUser.submitStats.acSubmissionNum;
        const total = stats.find(s => s.difficulty === 'All').count;
        const easy = stats.find(s => s.difficulty === 'Easy').count;
        const medium = stats.find(s => s.difficulty === 'Medium').count;
        const hard = stats.find(s => s.difficulty === 'Hard').count;
        
        return {
            username,
            ranking: data.matchedUser.profile.ranking,
            total_solved: total,
            easy_solved: easy,
            medium_solved: medium,
            hard_solved: hard,
            last_synced: new Date()
        };

    } catch (error) {
        console.error('LeetCode Service Error:', error.message);
        throw new Error('Failed to fetch LeetCode stats');
    }
};

module.exports = { fetchLeetCodeStats };
