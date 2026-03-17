try {
    console.log('Testing dashboard route load...');
    const dashboard = require('./routes/dashboard');
    console.log('Dashboard route loaded successfully');
} catch (error) {
    console.error('Error loading dashboard route:', error);
}
