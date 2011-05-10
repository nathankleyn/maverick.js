// # Requirements

// Load the bare minimal test stuff.
var nodePath = require('path')
    nodeHttp = require('http'),
    moduleDir = nodePath.join(__dirname, "../../"),
    Steps = require('cucumis-rm').Steps,
    assert = require('assert')

// Load the modules of Maverick you need.
require(nodePath.join(moduleDir, 'lib/view_renderer'));

// Load the Maverick object itself into this scope to get what we required
// previously.
var Maverick = require(nodePath.join(moduleDir, "lib/maverick"));

// # States

Steps.states.viewRendererTriggered = false;
Steps.states.viewRendererArgs;

// # Tests

// Given

Steps.Given(/^I have a "([^"]*?)" view renderer$/, function (ctx, viewRendererName) {
  Maverick.ViewRenderers[viewRendererName] = function() {
    Steps.states.viewRendererTriggered = true;
    Steps.states.viewRendererArgs = _.toArray(arguments);
  }
  ctx.done();
});

// When

Steps.When(/^I call the "([^"]*?)" renderer with "([^"]*?)" as arguments$/, function (ctx, viewRendererName, args) {
  args = args.split(",");
  Maverick.ViewRenderer.render.apply(this, [viewRendererName].concat(args));
  ctx.done();
});

// Then

Steps.Then(/^the "([^"]*?)" view renderer should be called$/, function (ctx, arg1) {
  assert.ok(Steps.states.viewRendererTriggered);
  ctx.done();
});

Steps.Then(/^the "([^"]*?)" view renderer should be passed "([^"]*?)"$/, function (ctx, viewRendererName, args) {
  assert.equal(Steps.states.viewRendererArgs.join(","), args);
  ctx.done();
});

// # Export

// Export our additions to the steps module.
Steps.export(module);
