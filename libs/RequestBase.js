//var https = require('https');

var request = require('request');

class RequestBase {
    onData(options, body) {
    }

    onError(options, error, body) {
    }

    onFinished(options) {
    }

    /*request(options) {
        var ref = this;
        https.get(options, function(res){
        console.log('status code: ' + res.statusCode);
        console.log('headers: ' + res.headers);

        res.on('data', function(data){
                ref.onData(options, data);
                ref.onFinished(options);
            });
        }).on('error', function(err){
            ref.onError(options, err, "");
            ref.onFinished(options);
        });
    }*/

    req(option){
        var ref = this;
        request(option, function(error,response,body) {
            if(error){
                ref.onError(option, error, body);
            } else {
                ref.onData(option, body);
            }
            console.log(body);
        });
    }
}

module.exports = RequestBase