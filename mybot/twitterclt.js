var Twitter = require('twitter-node-client').Twitter;
var config = require('config');

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
        } catch (o){
            //console.log(o);
        } finally {}
    }, this);
};

var twitter = new Twitter(config.get('twitter'));

twitter.getSearch({'q':'#定食', 'count':20, 'geocode':'35.654715,139.796599,30km'}, error, success);