const fs = require('fs');
const { FormData } = require('undici'); // Node 22 native fetch uses undici often, but global FormData is available

async function run() {
  const formData = new FormData();
  formData.append('user_id', '2');
  formData.append('title', 'API Test Item 2');
  formData.append('price', '150');
  formData.append('category', 'Tops');
  formData.append('condition', 'new');
  formData.append('listingType', 'sell');
  formData.append('description', 'Test desc');
  
  // Use a Blob to simulate File
  const fileContent = Buffer.from('dummy image content');
  const blob = new Blob([fileContent], { type: 'image/jpeg' });
  formData.append('image', blob, 'test.jpg');
  
  try {
    const res = await fetch('http://localhost:5000/api/items/create', { method: 'POST', body: formData });
    console.log('Status code:', res.status);
    console.log('Response body:', await res.text());
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
run().catch(console.error);
