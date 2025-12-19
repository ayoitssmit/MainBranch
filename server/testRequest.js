const axios = require('axios');
(async () => {
  try {
    const reg = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Register response:', reg.data);
    const token = reg.data.token;
    const post = await axios.post('http://localhost:5000/api/posts', {
      title: 'Test Post',
      content: 'Hello world'
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Post created:', post.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
})();
