import http from 'http';

http.get('http://localhost:3000/static/images/profile.jpg', (res) => {
  console.log('Status Code:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
