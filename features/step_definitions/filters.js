// # Requirements

// Load the bare minimal test stuff.
var nodePath = require('path')
    nodeHttp = require('http'),
    moduleDir = nodePath.join(__dirname, "../../"),
    Steps = require('cucumis-rm').Steps,
    assert = require('assert')

// Load the modules of Maverick you need.
require(nodePath.join(moduleDir, 'lib/routes'));
require(nodePath.join(moduleDir, 'lib/router'));
require(nodePath.join(moduleDir, 'lib/filters'));
require(nodePath.join(moduleDir, 'lib/controller'));

// Load the Maverick object itself into this scope to get what we required
// previously.
var Maverick = require(nodePath.join(moduleDir, "lib/maverick"));

// # States

Steps.states.routeTriggered = false;
Steps.states.filterTriggered = false;

// # Tests

// Given

Steps.Given(/^that I have a controller action for the route "([^"]*?)"$/, function (ctx, route) {

  Steps.states.controller = new Maverick.Controller(function() {

    this.get(route, function() {
      Steps.states.routeTriggered = true;
    });

  });

  Maverick.Controllers.Test = Steps.states.controller;

  ctx.done();
});

Steps.Given(/^I have (?:a|an) "(before|after)" filter for the route "([^"]*?)"$/, function (ctx, type, route) {
  Steps.states.controller.update(function() {

    this[type + "Filter"](route, function() {
      Steps.states.filterTriggered = true;
    });

  });

  ctx.done();
});

Steps.Given(/^I have an "around" filter for the route "([^"]*?)" that executes the action$/, function (ctx, route) {
  Steps.states.controller.update(function() {

    this.aroundFilter(route, function(yield) {
      Steps.states.filterTriggered = true;
      yield();
    });

  });

  ctx.done();
});

Steps.Given(/^I have an "around" filter for the route "([^"]*?)" that does not execute the action$/, function (ctx, route) {
  Steps.states.controller.update(function() {

    this.aroundFilter(route, function(yield) {
      Steps.states.filterTriggered = true;
    });

  });

  ctx.done();
});

// When

Steps.When(/^I trigger the route "([^"]*?)"$/, function (ctx, route) {
  var router = new Maverick.Router({
    "request" : {}
  });
  router.resolveRoute({
    "method" : "GET",
    "path" : route
  });
  ctx.done();
});

// Then

Steps.Then(/^the "([^"]*?)" filter for the route "([^"]*?)" should be triggered$/, function (ctx, type, route) {
  assert.ok(Steps.states.filterTriggered);
  ctx.done();
});

Steps.Then(/^the action for the route "([^"]*?)" should be triggered$/, function (ctx, arg1) {
  assert.ok(Steps.states.routeTriggered);
  ctx.done();
});

Steps.Then(/^the action for the route "([^"]*?)" should not be triggered$/, function (ctx, arg1) {
  assert.ok(!Steps.states.routeTriggered);
  ctx.done();
});

// # Export

// Export our additions to the steps module.
Steps.export(module);
