const Twitter = require('twitter-node-client').Twitter;
const config = require('config');
var parse = require('./parse.js');

var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
};

var success = function (data) {
    var ans = JSON.parse(data);
    var stats = ans.statuses;
    //console.log( "%s",ans.statuses);
    stats.forEach(function(element) {
        try {
            console.log(
                "{id:'%s', text:'%s', tag:'%s', geo:'%s'}"
                ,element.id
                ,element.text
                ,element.entities.hashtags[0].text
                ,element.geo!=null?JSON.stringify(element.geo):''
                );
            // kuromojiでの解析
            // parse.parse(element.text,function(path) {
            //     path.forEach(function (t){
            //         if (t.pos =='形容詞') {
            //             console.log("{id:%s, eval:'%s'}",element.id,t.basic_form);
            //         };
            //         if ((t.pos_detail_1 =='固有名詞' 
            //          || t.pos_detail_1 =='接尾')
            //          && t.basic_form !='*') {
            //             console.log("{id:%s, noun:'%s'}",element.id,t.basic_form);
            //         }
            //     });
            // });
            //MS TextAnalyzerによる解析
            // parse.txtanalyze(element.text, function(){
            //     parse.response();
            // });
        } catch (o){
            //console.log(o);
        } finally {}
    }, this);
};

var twitter = new Twitter(config.get('twitter'));

var cities = require('./config/city.json');

cities.forEach(function (city){
    var geo = city.latitude.toString()+ ',' + city.longitude.toString()+ ',10km';
    //console.log(geo);
    twitter.getSearch(
        {
            'q': '#ラーメン', 
            'count': 1, 
            'geocode': geo 
        }, 
        error, success);
});
