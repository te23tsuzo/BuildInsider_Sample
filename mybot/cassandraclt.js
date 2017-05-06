const cassandra = require('cassandra-driver');
const config = require('config');
const async = require('async');

const client = new cassandra.Client(config.get('cassandra'));
const query = 'select id, title, content, tags, created_at from posts where title = ?';

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
            'CREATE TABLE IF NOT EXISTS mykeyspace.posts ( id text PRIMARY KEY, content text, created_at timestamp, tags set<text>, title text);'
            ,'CREATE INDEX IF NOT EXISTS posts_title ON mykeyspace.posts (title);'
            ];

    //テーブルとインデックスを生成する
    async.eachSeries(queries, function(q,next) {
        client.execute(q, {}, {}, function(err) {
        //console.log(err);
        //mykeyspaceスキーマがない場合はmykeyspaceスキーマを作成する
        if (err !=null) {
            client.keyspace = "system"; 
            client.execute("CREATE KEYSPACE IF NOT EXISTS mykeyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;"
            ,{},function(err) {
                if (err == null) {
                    console.log("create keyspace.");
                    //スキーマが生成された後に改めてクエリを実行
                    client.execute(q,{},{},function(err){
                        console.log(q);
                        setTimeout(next, 1000);            
                    });
                } else {
                    console.log("error in keyspace create");
                    console.log(err);
                    process.exit();
                }
            });
        } else {
            console.log(q);
            setTimeout(next, 1000);
        }
        });
    }, function(err) {
        console.log("created schema.");
        process.exit();
    });

    //本当はbatchメソッドで処理したいがDDLが実行できない
    // client.batch(queries,{},function(err,result){
    //     if (err != null) {
    //         console.log("error in create table.");
    //         console.log(err);       
    //     } 
    //     else 
    //     {
    //         console.log("create table and index.");
    //         console.log(result);
    //     }
    //     process.exit();
    // });
}