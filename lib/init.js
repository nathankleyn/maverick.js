var nodePath = require('path'),
    moduleDir = nodePath.join(__dirname, "../");

require(nodePath.join(moduleDir, 'lib/server'));
require(nodePath.join(moduleDir, 'lib/application'));
require(nodePath.join(moduleDir, 'lib/router'));
require(nodePath.join(moduleDir, 'lib/routes'));
require(nodePath.join(moduleDir, 'lib/filters'));
require(nodePath.join(moduleDir, 'lib/view_renderer'));
require(nodePath.join(moduleDir, 'lib/controller'));

var Maverick = require(nodePath.join(__dirname, "maverick"));
module.exports = Maverick;
