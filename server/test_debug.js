try {
    console.log('Testing postRoutes require...');
    require('./routes/postRoutes');
    console.log('postRoutes loaded successfully');
} catch (error) {
    console.error('postRoutes FAILED:', error);
}

try {
    console.log('Testing userRoutes require...');
    require('./routes/userRoutes');
    console.log('userRoutes loaded successfully');
} catch (error) {
    console.error('userRoutes FAILED:', error);
}
