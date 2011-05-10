var nodePath = require('path');

var Maverick = {
  "Models" : {},
  "ViewRenderers" : {},
  "Controllers" : {},
  "Helpers" : {},
  "Dirs" : {
    "moduleDir" : nodePath.join(__dirname, '../')
  }
};

module.exports = Maverick;
