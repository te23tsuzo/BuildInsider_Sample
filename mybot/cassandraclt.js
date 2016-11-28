const cassandra = require('cassandra-driver');
var config = require('config');

const client = new cassandra.Client(config.get('cassandra'));
const query = 'select id, title, content from posts where title like ?';

var displayRow = function (n,row) {console.log(row);return;};

var displayError = function(err) {
    if (err !=null) {
        console.log('Error =%s',err);
        process.exit();
    } else {
        process.exit();
    }
};

exports.select = function (keyword) {
    client.eachRow(query,[keyword],{autoPage: false, prepare: true},
        displayRow,
        displayError
    );
}

exports.insert = function (err, post) {
   console.log("Id:%s", post.id);

   client.execute(
       "insert into posts (id, title, content) values (?, ?, ?)",
       [post.id, post.title, post.content],{prepare: true,hint: ["text","text","text"]},
        err);  
}
