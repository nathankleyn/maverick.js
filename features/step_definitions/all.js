// # Requirements

// Load the steps object from cucumis itself.
var Steps = require("cucumis-rm").Steps,
    _ = require("underscore");

_.mixin({
  "deepExtend" : function(target) {
    var i = 1,
        length = arguments.length,
        source;

    for (; i < length; i++) {
      // Only deal with defined values
      if ((source = arguments[i]) !== undefined ) {
        Object.getOwnPropertyNames(source).forEach(function(k) {
          var d = Object.getOwnPropertyDescriptor(source, k) || {
            "value" : source[k]
          };

          if (d.get) {
            target.__defineGetter__(k, d.get);
            if (d.set) {
              target.__defineSetter__(k, d.set);
            }
          } else if (target !== d.value) {
            target[k] = d.value;
          }

        });
      }
    }

    return target;
  },
  "deepClone" : function(source) {
    return _.deepExtend({}, source);
  }
});

// # States

// Set up the states object if it doesn't exist.
if(!Steps.states) Steps.states = {};

// # Callbacks

var states;

// Take a save of the current states to restore before each scenario and
// clear the incoming states to ensure a clean slate for the next test.
Steps.Runner.on("beforeScenario", function(done) {
  if(!states) {
    states = _.deepClone(require('cucumis-rm').Steps.states);
  }

  Steps.states = _.deepClone(states);
  done();
});

// # Export

// Export our additions to the steps module.
Steps.export(module);
