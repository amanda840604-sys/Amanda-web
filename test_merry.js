import http from 'http';

http.get('http://localhost:3000/assets_img/images/merry_logo.jpg', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error('Request error:', e.message);
});
