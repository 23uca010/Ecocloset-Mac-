const db = require('./database/sqlite');
const admin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@gmail.com');
console.log('Admin ID:', admin.id); 

fetch('http://localhost:5000/api/admin/users', { 
  headers: { 'Authorization': 'Bearer mock-jwt-token-' + admin.id } 
})
.then(r => r.json())
.then(data => {
  console.log("Response:", JSON.stringify(data, null, 2));
  if (data.success && data.data.users) {
     console.log("Successfully fetched users:", data.data.users.length);
  } else {
     console.log("Failed to fetch properly");
  }
})
.catch(console.error);
