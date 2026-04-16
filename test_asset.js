import http from 'http';

http.get('http://localhost:3000/assets_img/images/profile.jpg', (res) => {
  console.log('Status:', res.statusCode);
  if (res.statusCode !== 200) {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => console.log('Response body:', rawData));
  }
}).on('error', (e) => {
  console.error('Request error:', e.message);
});
