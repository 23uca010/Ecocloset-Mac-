const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function run() {
  const formData = new FormData();
  formData.append('user_id', 2);
  formData.append('title', 'API Test Item');
  formData.append('price', 150);
  formData.append('category', 'Tops');
  formData.append('condition', 'new');
  formData.append('listingType', 'sell');
  formData.append('description', 'Test desc');
  
  fs.writeFileSync('test.txt', 'dummy content');
  formData.append('image', fs.createReadStream('test.txt'));
  
  try {
    const res = await fetch('http://localhost:5000/api/items/create', { method: 'POST', body: formData });
    console.log('Status code:', res.status);
    console.log('Response body:', await res.text());
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    if (fs.existsSync('test.txt')) {
      fs.unlinkSync('test.txt');
    }
  }
}
run().catch(console.error);
