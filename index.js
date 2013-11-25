var http = require('http'),
    ga   = require('./libs/ga').ga;

http.createServer(function (req, res) {
    ga(function( _ga ){
        _ga('create', 'UA-45052666-1', 'mujiang.info');
        _ga('send', 'event', 'video_ad', 'youku', 'qtp');
    })
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
    console.log('done');
}).listen(1337, "127.0.0.1");
