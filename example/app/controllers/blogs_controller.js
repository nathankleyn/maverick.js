Maverick.Controllers.Articles = new Maverick.Controller(function() {

  this.get('/articles', function() {
    return "Found!";
  });

  this.get('/articles/:id', function() {
    return "Found " + this.params.id.toString() + "!";
  });

  this.post('/articles', function() {
    return "Creating!";
  });

  this.put('/articles/:id', function() {
    return "Updating " + this.params.id.toString() + "!";
  });

  this.delete('/articles/:id', function() {
    return "Deleting " + this.params.id.toString() + "!";
  });

});
