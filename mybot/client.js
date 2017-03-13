var clients = require('restify-clients');

var client = clients.createJsonClient({

  url: 'http://localhost:8080'
});

/*
* Restサーバ応答検証用
*/
client.get('/posts/ramen', function (err, req, res, obj) {
  console.log('Server returned: %j', obj);
});