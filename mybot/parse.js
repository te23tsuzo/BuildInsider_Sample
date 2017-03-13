const config = require('config');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

/*
* Azure Congnitive Serviceを使ったテキスト検証
*/
exports.txtanalyze = function(content,next) {
    var xhr = new XMLHttpRequest();
    
    //リクエストヘッダの設定
    xhr.onreadystatechange = function() {
        if (xhr.readyState == xhr.OPENED && xhr.getRequestHeader('Content-Type') != 'application/json') {
            xhr.setRequestHeader('Content-Type','application/json');
            xhr.setRequestHeader('Ocp-Apim-Subscription-Key', config.get('cognitive').key);
            //console.log('[%s:%s]', xhr.readyState , xhr.getRequestHeader('Content-Type'));
        }
    };
    
    //レスポンスの回収
    xhr.onload = function () {
        if (xhr != null && xhr.readyState ==xhr.DONE) {
            next(xhr.responseText);
            xhr.responseText ="";
        } else {
            console.log ("xhr is not done. %s.", xhr.readyState);
            console.log (xhr.responseText);
        }
    };

    //Analyzerオープン
    //console.log("preopen state is %s", xhr.readyState);
    if (xhr.readyState < xhr.OPENED) { 
        xhr.open("POST", config.get('cognitive').url,true );
    };
    
    //送信電文の作成と送信
    //console.log ("text:%s", content.text);
    var data = { "documents": [
                {
                    "language": "ja",
                    "id": content.postId,
                    "text": content.text
                }]}; 
    xhr.send(JSON.stringify( data));
};

//検証
// module.exports.txtanalyze({postId: "1", text: "今日はとても寒くて、気分が憂鬱"},function(data){
//     console.log("done.");
//     console.log(data);
// });