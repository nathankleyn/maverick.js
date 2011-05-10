var nodePath = require('path')
    nodeHttp = require('http'),
    moduleDir = nodePath.join(__dirname, "../../");

require(nodePath.join(moduleDir, 'lib/routes'));
require(nodePath.join(moduleDir, 'lib/controller'));

var Maverick = require(nodePath.join(moduleDir, "lib/maverick")),
    Steps = require('cucumis-rm').Steps,
    assert = require('assert');

/* */

Steps.export(module);
