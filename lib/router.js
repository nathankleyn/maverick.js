var nodePath = require('path');
var Maverick = require(nodePath.join(__dirname, "maverick"));

var _ = require('underscore');

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

        Maverick.Filters.runFilters('before', me, controller, request);

        var yield = function() {
          formulatedParams = me.formulateParams(route, routeMatches);
          controller.params = formulatedParams;
          if(!response) {
            response = me.normaliseResponse(route.callback.apply(controller));
          } else {
            throw new Error("Double render error, you may have possibly tried to run two around filters?");
          }
        }

        aroundMatch = Maverick.Filters.runFilters('around', me, controller, request, yield);
        if(!aroundMatch) yield();

        Maverick.Filters.runFilters('after', me, controller, request);

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
        "body" : response[1]
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
