var nodePath = require('path');
var Maverick = require(nodePath.join(__dirname, "maverick"));

Maverick.Routes = {};

Maverick.Routes.Matchers = {
  "wildcard" : "*",
  "wildcardSubstitution" : ".*",
  "namedParam" : /\:[^\/]*/g,
  "namedParamSubstitution" : "([^\/]+)",
  "namedParamWithCapture" : /\:([^\/]*)/g
};

Maverick.Routes.getParamsFromRoute = function(route, path) {
  var params = [],
      match;

  while(match = Maverick.Routes.Matchers.namedParamWithCapture.exec(route)) {
    params.push(match[1]);
  };

  return params;
};

// This method takes either a string or regex route and applies a callback if
// the route ever matches an incomming request.
Maverick.Routes.parseRoute = function(route, callback) {
  if(typeof route == "string") {
    // Replace astrisks with a matcher for anything but a forward slash zero or
    // more times.
    var regex = route.replace(Maverick.Routes.Matchers.wildcard, Maverick.Routes.Matchers.wildcardSubstitution);

    // Replace colons and any character but a slash with a matcher that matches any
    // character (with the exception of a slash), one or more times.
    regex = regex.replace(Maverick.Routes.Matchers.namedParam, Maverick.Routes.Matchers.namedParamSubstitution);

    // Create a regex that will match the expected route.
    regex = new RegExp("^" + regex + "$");

    var params = Maverick.Routes.getParamsFromRoute(route);
  } else {
    var regex = route,
        params = false;
  };

  var callback = (typeof callback === "string" ? this[callback] : callback);
  if(!callback) throw new TypeError("The callback you provide to a filter must be valid.");

  return {
    "route" : route,
    "regex" : regex,
    "paramNames" : params,
    "callback" : callback
  };
};

Maverick.Routes.get = function(route, callback) {
  this.routes.get.push(this.parseRoute(route, callback));
};

Maverick.Routes.post = function(route, callback) {
  this.routes.post.push(this.parseRoute(route, callback));
};

Maverick.Routes.put = function(route, callback) {
  this.routes.put.push(this.parseRoute(route, callback));
};

Maverick.Routes.delete = function(route, callback) {
  this.routes.delete.push(this.parseRoute(route, callback));
};
