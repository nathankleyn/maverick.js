var nodePath = require('path');
var Maverick = require(nodePath.join(__dirname, "maverick"));

Maverick.Filters = {};

Maverick.Filters.runFilters = function(type, target, controller, request, callback) {
  for(var k in controller.filters[type]) {
    var filter = controller.filters[type][k],
        filterMatches;
    if((filterMatches = filter.regex.exec(request.path)) !== null) {
      formulatedParams = target.formulateParams(filter, filterMatches);
      controller.params = formulatedParams.params;
      filter.callback.call(controller, callback);
      return true;
    } else {
      return false;
    }
  }
};

Maverick.Filters.beforeFilter = function(route, callback) {
  this.filters.before.push(this.parseRoute(route, callback));
};

Maverick.Filters.afterFilter = function(route, callback) {
  this.filters.after.push(this.parseRoute(route, callback));
};

Maverick.Filters.aroundFilter = function(route, callback) {
  this.filters.around.push(this.parseRoute(route, callback));
};
