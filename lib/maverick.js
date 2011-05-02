_ = require ('./underscore.js');

nodeUrl = require('url');
fs = require('fs');

/******************************************************************************/

Maverick = {};

// Maverick.Models = {};

Maverick.ViewRenderers = {};
Maverick.Controllers = {};
Maverick.Helpers = {};

/******************************************************************************/

Maverick.Application = function(callback) {
  this.defaultHeaders = {
    "Content-Type": "text/html"
  }

  // Execute the closure to get some settings from the user.
  if(callback) callback();
};

Maverick.Application.prototype.dispatch = function(port, address) {
  var me = this,
      port = port || 8000,
      address = address || "127.0.0.1";

  console.log("Dispatching Maverick Application");
  console.log("    listening on port " + port.toString() + " at " + address + "\n");

  this.loadDependencies();

  var server = new Maverick.Server();
  server.start(port, address, function(request) {
    if(!me.router) me.router = new Maverick.Router(me);
    server.respond(me.router.resolveRoute(request));
  });
};

Maverick.Application.prototype.loadDependencies = function() {
  var requireDirs = ['lib/view_renderers', 'app/controllers', 'app/helpers'];

  requireDirs.forEach(function(dir) {
    fs.readdir('./' + dir, function(err, files) {
      if(err) throw err;
      if(files) files.forEach(function(file) {
        require('../' + dir + '/' + file);
      });
    });
  });
}

/******************************************************************************/

Maverick.Server = function() {};

Maverick.Server.prototype.start = function(port, address, callback) {
  var http = require("http"),
      me = this;

  http.createServer(function (nodeRequest, nodeResponse) {
    me.nodeResponse = nodeResponse;
    me.nodeRequest = nodeRequest;
    me.request = Maverick.constructRequest(nodeRequest);
    callback(me.request);
  }).listen(port, address);
}

Maverick.Server.prototype.respond = function(response) {
  console.log(this.request.method + ' to ' + this.request.url + ' from ' + this.request.ip);

  if(response) {
    this.nodeResponse.writeHead(response.status, _.extend({}, this.defaultHeaders, response.headers));
    this.nodeResponse.end(response.body + "\n");

    console.log('    responded with ' + response.status);
  } else {
    this.nodeResponse.writeHead(404, this.defaultHeaders);
    this.nodeResponse.end("404 - Not Found\n");

    console.log('    responded with 404');
  }
}

/******************************************************************************/

Maverick.constructRequest = function(nodeRequest) {
  var request = {},
      url = nodeUrl.parse(nodeRequest.url, true);

  request.ip = nodeRequest.client.remoteAddress;
  request.method = nodeRequest.method;
  request.url = url.href;
  request.path = url.pathname;
  request.queryString = url.query;

  return request;
};

/******************************************************************************/

Maverick.Inflector = function() {};

/******************************************************************************/

Maverick.Router = function(application) {
  for(var controller in Maverick.Controllers) {
    Maverick.Controllers[controller].load(application);
  };
};

Maverick.Router.prototype.resolveRoute = function(request) {
  for(var i in Maverick.Controllers) {
    var controller = Maverick.Controllers[i],
        routes = controller.routes[request.method.toLowerCase()];

    for(var j in routes) {
      var route = routes[j],
          routeMatches;

      if((routeMatches = route.regex.exec(request.path)) !== null) {

        var response,
            me = this,
            aroundMatch = false;

        controller.request = request;

        this.runFilters('before', me, controller, request);

        var yield = function() {
          formulatedParams = me.formulateParams(route, routeMatches);
          controller.params = formulatedParams.params;
          if(!response) {
            response = me.normaliseResponse(route.callback.apply(controller));
          } else {
            throw new Error("Double render error, you may have possibly tried to run two around filters?");
          }
        }

        for(var k in controller.filters.around) {
          var filter = controller.filters.around[k],
              filterMatches;
          if((filterMatches = filter.regex.exec(request.path)) !== null) {
            aroundMatch = true;
            formulatedParams = me.formulateParams(filter, filterMatches);
            controller.params = formulatedParams.params;
            filter.callback.call(controller, yield);
          }
        }

        if(!aroundMatch) yield();

        this.runFilters('after', me, controller, request);

        return response;
      };

    };
  };

  return false;
};

Maverick.Router.prototype.formulateParams = function(route, matches) {
  var paramNames = route.paramNames,
      params = {};

  matches.shift();
  matches.forEach(function(match) {
    var paramName = paramNames.shift();
    params[paramName] = match;
  });

  return params;
}

Maverick.Router.prototype.runFilters = function(type, target, controller, request, callback) {
  for(var k in controller.filters[type]) {
    var filter = controller.filters[type][k],
        filterMatches;
    if((filterMatches = filter.regex.exec(request.path)) !== null) {
      formulatedParams = target.formulateParams(filter, filterMatches);
      controller.params = formulatedParams.params;
      filter.callback.call(controller, callback);
    }
  }
};

Maverick.Router.prototype.normaliseResponse = function(response) {
  var normalisedResponse = {
    "status" : 200,
    "headers" : {},
    "body" : ""
  };

  if(Array.isArray(response)) {
    if(response.length == 3) {
      // We'll extend here anyway, just in case we add future defaults.
      _.extend(normalisedResponse, {
        "status" : response[0],
        "headers" : response[1],
        "body" : response[2]
      });
    } else if(response.length == 2) {
      _.extend(normalisedResponse, {
        "status" : response[0],
        "headers" : response[1]
      });
    } else {
      throw new TypeError("If response is an Array, it must have a length of either 2 or 3.");
    };
  } else if(typeof response === "string") {
    _.extend(normalisedResponse, {
      "body" : response
    });
  } else if(typeof response === 'number') {
    _.extend(normalisedResponse, {
      "status" : response
    });
  } else if(typeof response === 'object') {
    _.extend(normalisedResponse, response);
  };

  return normalisedResponse;
};

/******************************************************************************/

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

/******************************************************************************/

Maverick.Filters = {};

Maverick.Filters.beforeFilter = function(route, callback) {
  this.filters.before.push(this.parseRoute(route, callback));
};

Maverick.Filters.afterFilter = function(route, callback) {
  this.filters.after.push(this.parseRoute(route, callback));
};

Maverick.Filters.aroundFilter = function(route, callback) {
  this.filters.around.push(this.parseRoute(route, callback));
};

/******************************************************************************/

Maverick.ViewRenderer = {}

Maverick.ViewRenderer.render = function() {
  var args = Array.prototype.slice.call(arguments),
      viewRendererName = args.shift();

  return Maverick.ViewRenderers[viewRendererName].apply(this, args);
}

/******************************************************************************/

Maverick.Controller = function(callback) {
  this.callback = callback;
};

Maverick.Controller.prototype.load = function(application) {
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

  this.callback();
};

_.extend(Maverick.Controller.prototype, Maverick.Filters, Maverick.Routes, Maverick.ViewRenderer);
