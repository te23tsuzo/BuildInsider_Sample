const cassandra = require('cassandra-driver');
const config = require('config');
const async = require('async');

const client = new cassandra.Client(config.get('cassandra'));
const query = 'select id, title, content from posts where title = ?';

var displayRow = function (n,row) {console.log(row);return;};

var displayError = function(err) {
    if (err !=null) {
        console.log('Error =%s',err);
        process.exit();
    } else {
        process.exit();
    }
};

/*
* データベースの内容を確認
* ストリーム検証用
*/
exports.select = function (keyword) {
    client.eachRow(query,[keyword],{autoPage: false, prepare: true},
        displayRow,
        displayError
    );
}

/*
* 検索結果を配列で返す
*/
exports.selectRows = function (keyword, cb) {
    console.log("keyword =%s", keyword);
    client.execute(query,[keyword],{autoPage: false, prepare: true},
    function(err, result) {
        if (err !=null ) console.log(err);
        cb(result.rows);
    });
}

/*
*投稿データ生成
*/
exports.insert = function (post) {
   console.log("Id:%s", post.id);

   client.execute(
       "insert into posts (id, title, content, tags, created_at) values (?, ?, ?, ?, dateof(now()))",
       [post.id, post.title, post.content, post.tags],
       {prepare: true,hint: ["text","text","text","set<text>"]},
       displayError
    );
}

/*
*Cassandra Keyspaceを初期化
*/
exports.initDb = function() {
    console.log("Db initialize.");

    const queries = [
            'Drop TABLE if exists mykeyspace.posts',
            'CREATE TABLE mykeyspace.posts ( id text PRIMARY KEY, content text, created_at timestamp, tags set<text>, title text)',
            'CREATE INDEX posts_title ON mykeyspace.posts (title)'
            ];
        
    async.each(queries, function(q,next) {
        //console.log(q);
        client.execute(q, {}, {}, displayError);
    }, function(err) {
        console.log(err);
    });

}