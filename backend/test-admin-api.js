const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const ADMIN_TOKEN = 'mock-jwt-token-1'; // Default admin id is 1

async function testAdminAPI() {
    console.log('--- TESTING ADMIN API ---');
    
    try {
        // 1. Test Stats
        console.log('\n[1] Testing Dashboard Stats...');
        const statsRes = await axios.get(`${API_URL}/admin/dashboard/stats`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log('Status:', statsRes.status);
        console.log('Data:', JSON.stringify(statsRes.data.data.overview, null, 2));

        // 2. Test Users List
        console.log('\n[2] Testing Users List...');
        const usersRes = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log('Status:', usersRes.status);
        console.log('User Count:', usersRes.data.data.users.length);

        // 3. Test Unauthorized Access
        console.log('\n[3] Testing Unauthorized Access (No Token)...');
        try {
            await axios.get(`${API_URL}/admin/users`);
        } catch (err) {
            console.log('Status (Expected 401):', err.response.status);
        }

        console.log('\n--- VERIFICATION COMPLETE ---');
    } catch (error) {
        console.error('Verification failed:', error.message);
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        }
    }
}

testAdminAPI();
