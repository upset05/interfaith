const https = require('https');

https.get('https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/logo.jpeg', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Content-type:', res.headers['content-type']);
}).on('error', (e) => {
  console.error(e);
});
