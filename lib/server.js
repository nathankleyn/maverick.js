var nodePath = require('path');
var Maverick = require(nodePath.join(__dirname, "maverick"));

var nodeUrl = require('url');
var _ = require('underscore');

Maverick.Server = function(port, callback, startupCallback) {
  var me = this;

  this.logging = true;
  this.port = port;
  this.httpServer = require("http").createServer(function (nodeRequest, nodeResponse) {
    me.nodeResponse = nodeResponse;
    me.nodeRequest = nodeRequest;
    me.request = Maverick.Server.constructRequest(nodeRequest);
    callback.call(me, me.request, me.nodeRequest);
  });
  this.httpServer.listen(this.port, startupCallback);
};

Maverick.Server.prototype.respond = function(response) {
  if(this.logging) {
    console.log(this.request.method + ' to ' + this.request.url + ' from ' + this.request.ip);
  }

  if(response) {
    this.nodeResponse.writeHead(response.status, _.extend({}, this.defaultHeaders, response.headers));
    this.nodeResponse.end(response.body + "\n");

    if(this.logging) {
      console.log('    responded with ' + response.status);
    }
  } else {
    this.nodeResponse.writeHead(404, this.defaultHeaders);
    this.nodeResponse.end("404 - Not Found\n");

    if(this.logging) {
      console.log('    responded with 404');
    }
  };
};

Maverick.Server.constructRequest = function(nodeRequest) {
  var request = {},
      url = nodeUrl.parse(nodeRequest.url, true);

  request.ip = nodeRequest.client.remoteAddress;
  request.method = nodeRequest.method;
  request.url = url.href;
  request.path = url.pathname;
  request.queryString = url.query;

  return request;
};
