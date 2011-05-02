Maverick.Controllers.Students = new Maverick.Controller(function() {

  this.beforeMethod = function() {
    console.log('BeforeMethod!');
  }

  this.afterMethod = function() {
    console.log('AfterMethod!');
  }

  this.beforeFilter('/1', 'beforeMethod');
  this.beforeFilter('/1', function() {
    console.log('Before!');
  });

  this.afterFilter('/1', 'afterMethod');
  this.afterFilter('/1', function() {
    console.log('After!');
  });

  this.aroundFilter('/2', function(yield) {
    console.log('Around before!');
    yield();
    console.log('Around after!');
  });

  this.get('/', function() {
    return this.render("Mustache", "students/index", {
      "object" : "world"
    });
  });

  this.get('/2', function() {
    return "Hello World 2!"
  });

});
