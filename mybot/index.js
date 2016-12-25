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
  
