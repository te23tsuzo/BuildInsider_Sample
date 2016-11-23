const kuromoji = require('kuromoji');
const parser = kuromoji.builder({dicPath:"./node_modules/kuromoji/dict"});

exports.parse = function (content, next) {
    parser.build(function (err,tokenizer) {
        var path = tokenizer.tokenize(content);
        //console.log(path);
        next(path);
    });
}
