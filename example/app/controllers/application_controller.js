Maverick.Controllers.Application = new Maverick.Controller(function() {

  this.beforeFilter('/', function() {
    console.log('hi there!');
  });

});
