var nodePath = require('path');
var Maverick = require(nodePath.join(__dirname, "maverick"));

var nodeFs = require('fs');

Maverick.Application = function(callback) {
  this.defaultHeaders = {
    "Content-Type": "text/html"
  }

  // Execute the closure to get some settings from the user.
  if(callback) callback();
};

Maverick.Application.prototype.setConfig = function(callback) {
  callback.apply(this);
}

Maverick.Application.prototype.dispatch = function(configDir, port) {
  var me = this;

  Maverick.currentApplication = this;

  // Set the port to a default if not provided in the inital call to dispatch.
  // This can be overwritten when the environment file is loaded.
  this.port = port || 8000,

  Maverick.Dirs.configDir = configDir;
  Maverick.Dirs.appDir = nodePath.resolve(Maverick.Dirs.configDir, '../'),

  // Set the current environment. This should be influenced by the incoming 
  this.environment = (process.env.MAVERICK_ENV ? process.env.MAVERICK_ENV : "development");

  this.requireDirs = [nodePath.join(Maverick.Dirs.moduleDir, "lib/view_renderers"), nodePath.join(Maverick.Dirs.appDir, "app/controllers"), nodePath.join(Maverick.Dirs.appDir, "app/helpers")];

  this.loadDependencies();

  console.log("Dispatching Maverick Application");
  console.log("    starting listener on port " + this.port.toString() + "\n");

  new Maverick.Server(this.port, function(request) {
    if(!me.router) me.router = new Maverick.Router(me);
    this.respond(me.router.resolveRoute(request));
  });
};

Maverick.Application.prototype.loadDependencies = function() {

  // Import the settings for this specific environment.
  require(nodePath.join(Maverick.Dirs.configDir, "environments/" + this.environment));

  this.requireDirs.forEach(function(dir) {
    nodeFs.readdir(nodePath.resolve(dir), function(err, files) {
      if(err) {
        console.log(dir);
        throw err;
      }

      if(files) files.forEach(function(file) {
        require(nodePath.join(dir, file));
      });
    });
  });
}
