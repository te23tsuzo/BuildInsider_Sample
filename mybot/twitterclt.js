const Twitter = require('twitter-node-client').Twitter;
const config = require('config');
const async = require('async');
var md5 = require('md5');
var parse = require('./parse.js');
var db = require('./cassandraclt.js');


var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
};

var success = function (data) {
    var ans = JSON.parse(data);
    var stats = ans.statuses;
    //console.log( "%s",ans.statuses);
    async.each(stats, function (element, next) {
        
        //ポストIDを文書から作成
        var postId = md5(element.text); 
        //cassandraに挿入
        db.insert(function(err){
            console.log(err);
        },
        {
            id: postId,
            title: "ラーメン",
            content: element.text
        }
        );

        //MS TextAnalyzerによる解析
        element.postId = postId;
        parse.txtanalyze(element, function(data){
            console.log("analyze:%s", data);
        });
    }, function(error) {
        console.log("End stats. %s", error);
    });
};

var twitter = new Twitter(config.get('twitter'));

var cities = require('./config/city.json');

async.each( cities,
    function (city,next){
        var geo = city.latitude.toString()+ ',' + city.longitude.toString()+ ',10km';
        //console.log(geo);
        twitter.getSearch(
            {
                'q': '#ラーメン', 
                'count': 10, 
                'geocode': geo 
            }, 
            error, success);
    }, function(error) {
        console.log("End. error at %s",error);
    }
);
