const Twitter = require('twitter-node-client').Twitter;
const config = require('config');
const async = require('async');
var md5 = require('md5');
var parse = require('./parse.js');
var db = require('./cassandraclt.js');
var _title;

//エラー表示ハンドラー
var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
};

//ツィート表示ハンドラー
var success = function (data) {
    var ans = JSON.parse(data);
    var stats = ans.statuses;
    //console.log( "%s",ans.statuses);
    async.each(stats, function (element, next) {
        
        //ポストIDを文書から作成
        var postId = md5(element.text); 
        
        //cassandraに挿入
        var tags = [];
        for (tag in element.entities.hashtags) {
            tags.push(element.entities.hashtags[tag].text);
        }
        console.log("Tag:%s",tags);
        
        db.insert({
            id: postId,
            title: _title,
            content: element.text,
            tags: tags
        });

    }, error);
};

/*
* データ収集
* Cityに登録された場所近辺でつぶやかれたものを10件ずつ収集する
*/
exports.collect = function(keyword) {
    var twitter = new Twitter(config.get('twitter'));
    var cities = require('./config/city.json');
    _title = keyword;

    async.each( cities,
        function (city,next){
            var geo = city.latitude.toString()+ ',' + city.longitude.toString()+ ',10km';
            //console.log(geo);
            twitter.getSearch(
                {
                    'q': keyword, 
                    'count': 10, 
                    'geocode': geo 
                }, 
                error, success);
        }, function(err) {
            console.log("End. error at %s",err);
        }
    );
};
