// # Requirements

// Load the bare minimal test stuff.
var nodePath = require('path')
    nodeHttp = require('http'),
    moduleDir = nodePath.join(__dirname, "../../"),
    Steps = require('cucumis-rm').Steps,
    assert = require('assert')

// Load the modules of Maverick you need.
require(nodePath.join(moduleDir, 'lib/routes'));
require(nodePath.join(moduleDir, 'lib/controller'));

// Load the Maverick object itself into this scope to get what we required
// previously.
var Maverick = require(nodePath.join(moduleDir, "lib/maverick"));

// # States

Steps.states.routeTriggered = false;
Steps.states.routeParams;

// # Tests

// Given

Steps.Given(/^I have a new controller$/, function (ctx) {
  Steps.states.controller = new Maverick.Controller(function() {});
  ctx.done();
});

// When

Steps.When(/^I add a "([^"]*?)" action for the route "([^"]*?)"$/, function (ctx, action, route) {
  Steps.states.controller.update(function() {

    this[action](route, function() {
      Steps.states.routeTriggered = true;
      Steps.states.routeParams = this.params;
    });

  });

  ctx.done();
});

Steps.When(/^I load the controller$/, function (ctx) {
  Maverick.Controllers.Test = Steps.states.controller;
  Steps.states.controller.load({
    "request" : {}
  });
  ctx.done();
});

// Then

Steps.Then(/^the controller should have a "([^"]*?)" route$/, function (ctx, type) {
  assert.equal(Steps.states.controller.routes[type].length, 1);
  ctx.done();
});

Steps.Then(/^the action should be triggered$/, function(ctx) {
  assert.ok(Steps.states.routeTriggered);
  ctx.done();
});

Steps.Then(/^there should be (?:a|an) "([^"]*?)" param with the value "([^"]*?)"$/, function (ctx, key, value) {
  assert.equal(Steps.states.routeParams[key].toString(), value);
  ctx.done();
});

Steps.Then(/^there should be no params$/, function (ctx) {
  assert.equal(_.keys(Steps.states.routeParams).length, 0);
  ctx.done();
});


// # Export

// Export our additions to the steps module.
Steps.export(module);
