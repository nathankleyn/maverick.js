var nodePath = require('path');
var Maverick = require(nodePath.join(__dirname, "maverick"));

var _ = require('underscore');

Maverick.Controller = function(callback) {
  this.callbacks = [callback];
};

Maverick.Controller.prototype.update = function(callback) {
  this.callbacks.push(callback);
};

Maverick.Controller.prototype.load = function(application) {
  var me = this;

  this.request = application.request;

  this.routes = {
    "get" : [],
    "post" : [],
    "put" : [],
    "delete" : []
  };

  this.filters = {
    "before" : [],
    "after" : [],
    "around" : []
  };

  this.callbacks.forEach(function(callback) {
    callback.call(me);
  });
};

_.extend(Maverick.Controller.prototype, Maverick.Filters, Maverick.Routes, Maverick.ViewRenderer);
