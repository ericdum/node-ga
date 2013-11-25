var http = require('http'),
    queryString = require('querystring');

/**
 * Usage: ga(function( _ga ){
 *     _ga("create", "UA-45052666-1");
 * })
 */
module.exports.ga = function( make ) {
    var collect = new Collect();

    function analytics(method) {
        next(method.toLowerCase());
    }

    function next(method){
        if ( typeof collect[method] == "function" ) {
            collect[method].apply(collect, Array.prototype.slice.call(arguments.callee.caller.arguments, 1));
        } else {
            console.log(method+" no found!", arguments.callee.caller.arguments);
        }
    }

    function Collect(){
        this.collects = [];
    }

    Collect.prototype.send = function( type ){
        collect.hitType = type.toLowerCase(); //lastest hit type
        next("send"+collect.hitType[0].toUpperCase()+collect.hitType.slice(1));
    }

    Collect.prototype.create = function(clientId, options ){
        if ( typeof options == "string" ) {
            options = {'name' : options};
        }

        this.clientId   = clientId;
        this.userAgent  = ''//options.userAgent;
        this.name       = options.name       || "t0";
        this.sampleRate = options.sampleRate || 100;
        /*
        this.siteSpeedSampleRate = options.siteSpeedSampleRate || 1;
        this.alwaysSendReferrer = options.alwaysSendReferrer || false;
        this.allowAnchor = options.allowAnchor || true;
        this.cookieName = options.cookieName || "_ga";
        */
    }

    Collect.prototype.sendPageview = function(){
    }

    Collect.prototype.sendEvent = function(category, action, label, value){ 
        this.collects.push({
            t  : this.hitType,
            ec : category,
            ea : action,
            el : label,
            ev : value,
        });
    }

    Collect.prototype.request = function(){
        var query = {
            v   : 1,
            tid : this.clientId,
            cid : 0,
        };
        var headers = {
            'Content-Type':'application/x-www-form-urlencoded',
            'User-Agent': this.userAgent
        };

        var path = "/collect";
        var query_base = queryString.stringify(query) + "&";

        for( i in this.collects ){
            var content = query_base + queryString.stringify(this.collects[i]);
            headers["Content-Length"] = content.length;
            var req = http.request({
                hostname : 'www.google-analytics.com',
                path     : path,
                headers  : headers,
                method   : 'POST'
            }, function(res){
                console.log(res.statusCode);
            });
            req.write(content);
            req.end();
        }
    }

    function getQueryString( obj ){
        var query = [];
        for( var k in obj ) {
            if( typeof obj[k] != "undefined" )
                query.push(k + "=" + encodeURI(obj[k]));
        }
        return query.join('&');
    }

    //用户设置跟踪
    make(analytics);

    //上传
    console.log('send');
    collect.request();
}

