import http from 'http';

http.get('http://localhost:3000/static/images/keyshot-logo-1.jpg', (res) => {
  console.log('Keyshot Status:', res.statusCode);
});
