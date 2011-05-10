var nodePath = require('path');
var Maverick = require(nodePath.join(__dirname, "maverick"));

Maverick.ViewRenderer = {}

Maverick.ViewRenderer.render = function() {
  var args = Array.prototype.slice.call(arguments),
      viewRendererName = args.shift();

  return Maverick.ViewRenderers[viewRendererName].apply(this, args);
}
