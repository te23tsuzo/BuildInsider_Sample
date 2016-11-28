const Twitter = require('twitter-node-client').Twitter;
const config = require('config');
const async = require('async');
var parse = require('./parse.js');


var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
};

var success = function (data) {
    var ans = JSON.parse(data);
    var stats = ans.statuses;
    //console.log( "%s",ans.statuses);
    async.each(stats, function (element, next) {
        //MS TextAnalyzerによる解析
        parse.txtanalyze(element, function(data){
            console.log("analyze:%s", data);
        });
    }, function(error) {
        console.log(error);
    });
};

var twitter = new Twitter(config.get('twitter'));

var cities = require('./config/city.json');

async.each( cities,function (city,next){
    var geo = city.latitude.toString()+ ',' + city.longitude.toString()+ ',10km';
    //console.log(geo);
    twitter.getSearch(
        {
            'q': '#ラーメン', 
            'count': 1, 
            'geocode': geo 
        }, 
        error, success);
    }, function(error) {
        console.log("End. error at %s",error);
});
