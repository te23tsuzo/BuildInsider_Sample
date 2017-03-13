var restify = require('restify');
var db = require('./cassandraclt.js');

// Setup Restify Server
var server = restify.createServer({
    name: 'mybot',
    version: '0.0.1'
});

/*
* Restサーバ
* キーワードで指定されたタイトルの記事一覧を返す
*/
server.get('/posts/:keyword', function (req, res, next) {
    console.log(req.params);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');

    db.selectRows(req.params.keyword,function(rows) {
        console.log("returns:%s",rows.length);
        res.send(rows);
    });
    return next();
});

/*
* サーバのポートを指定
*/
server.listen(process.env.port || process.env.PORT || 8080, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
