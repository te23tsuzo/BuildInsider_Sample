const Twitter = require('twitter-node-client').Twitter;
const config = require('config');
const async = require('async');
var md5 = require('md5');
var parse = require('./parse.js');
var db = require('./cassandraclt.js');

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
        

        //MS TextAnalyzerによる解析
        // element.postId = postId;
        // parse.txtanalyze(element, function(data){
        //     var phrases = JSON.parse(data);
        //     if (typeof(phrases) != "undefined") {
        //         console.log(phrases.documents);
        //     }
        // });

        //cassandraに挿入
        var tags = [];
        for (tag in element.entities.hashtags) {
            tags.push(element.entities.hashtags[tag].text);
        }
        console.log("Tag:%s",tags);
        
        db.insert({
            id: postId,
            title: "ラーメン",
            content: element.text,
            tags: tags
        });

    }, error);
};

//データ収集
// Cityに登録された場所近辺でつぶやかれたものを10件ずつ収集する
exports.collect = function(keyword) {
    var twitter = new Twitter(config.get('twitter'));

    var cities = require('./config/city.json');

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

module.exports.collect('#ラーメン');