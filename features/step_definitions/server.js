// # Requirements

// Load the bare minimal test stuff.
var nodePath = require('path')
    nodeHttp = require('http'),
    moduleDir = nodePath.join(__dirname, "../../"),
    Steps = require('cucumis-rm').Steps,
    assert = require('assert')

// Load the modules of Maverick you need.
require(nodePath.join(moduleDir, 'lib/server'));

// Load the Maverick object itself into this scope to get what we required
// previously.
var Maverick = require(nodePath.join(moduleDir, "lib/maverick"));

// # States

Steps.states.serverConnections = [];

// # Callbacks

// Clean up any running serves by ensuring they are closed for connections
// at the end of the scenario.
Steps.Runner.on("afterScenario", function(done) {

  if(Steps.states.server && Steps.states.server.httpServer) {
    try {
      Steps.states.server.httpServer.close();
      Steps.states.serverConnections.forEach(function(serverConnection) {
        serverConnection.destroy();
      });
    } catch(e) {}
  }

  done();

});

// # Tests

// Given

Steps.Given(/^I have a new instance of the server with port "([^"]*?)"$/, function (ctx, port) {
  Steps.states.server = new Maverick.Server(parseInt(port), function(request, nodeRequest) {
    Steps.states.serverStarted = true;
    Steps.states.serverRequest = request;
    Steps.states.serverConnections.push(nodeRequest.connection);
    Steps.states.server.respond();
  }, function() {
    Steps.states.server.logging = false;
    ctx.done();
  });
});

// When

Steps.When(/^I trigger a request$/, function(ctx) {
  nodeHttp.get({
    "host" : "127.0.0.1",
    "port" : Steps.states.server.port,
    "path" : "/"
  }, function(response) {
    ctx.done();
  });
});

// Then

Steps.Then(/^a server should be running$/, function (ctx) {
  assert.ok(Steps.states.serverStarted);
  ctx.done();
});

Steps.Then(/^a server should be listening on port (\d+)$/, function (ctx, port) {
  assert.equal(Steps.states.server.port, port);
  ctx.done();
});

// # Export

// Export our additions to the steps module.
Steps.export(module);
