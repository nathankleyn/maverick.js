Maverick.ViewRenderers.Mustache = function(viewPath, data, options) {
  data = {
    "yield" : (data || {})
  };

  options = _.extend({
    "layoutPath" : "layouts/application"
  }, options);

  require('../mustache.js');
  var layout = nodeFs.readFileSync('./app/views/' + options.layoutPath + '.html', "UTF-8"),
      view = nodeFs.readFileSync('./app/views/' + viewPath + '.html', "UTF-8");

  var body = Mustache.to_html(layout, data, {
    "yield" : view
  });

  return {
    "body" : body
  }
}
