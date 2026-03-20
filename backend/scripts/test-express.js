console.log('Script started');
try {
    const express = require('express');
    console.log('Express loaded');
    const app = express();
    app.get('/', (req, res) => res.send('OK'));
    app.listen(5000, () => {
        console.log('Server listening on port 5000');
        process.exit(0);
    });
} catch (e) {
    console.error('Error:', e);
}
