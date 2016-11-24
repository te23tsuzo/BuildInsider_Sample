//const kuromoji = require('kuromoji');
const config = require('config');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const parser = kuromoji.builder({dicPath:"./node_modules/kuromoji/dict"});
var xhr = new XMLHttpRequest();
    
// exports.parse = function (content, next) {
//     parser.build(function (err,tokenizer) {
//         var path = tokenizer.tokenize(content);
//         //console.log(path);
//         next(path);
//     });
// }

exports.txtanalyze = function(content,next) {
    xhr.resposeText ='';
    xhr.onload = next;
    xhr.onreadystatechange = function() {
        //console.log(xhr.readyState);
        try {
            if (xhr.readyState == xhr.OPENED) {
                xhr.setRequestHeader('Content-Type','application/json');
                xhr.setRequestHeader('Ocp-Apim-Subscription-Key', config.get('cognitive').key);
                //console.log('%s,%s', xhr.getRequestHeader('Content-Type'), xhr.getRequestHeader('Ocp-Apim-Subscription-Key'));
            }
        } catch (o) {
            //console.log(o);
        } finally {}
        };
    
    xhr.open("POST", config.get('cognitive').url,true );
    var data = { "documents": [
                {
                    "language": "ja",
                    "id": "100",
                    "text": content
                }]}; 
    xhr.send(JSON.stringify( data));
};

exports.response = function() {
    console.log(xhr.responseText);
    return xhr.responseText;
}

//検証
this.txtanalyze("今日はとても寒くて、気分が憂鬱",function(){
    console.log("done.");
    module.exports.response();
});