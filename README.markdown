# Maverick.js

Maverick.js, or Maverick for short, is a Node.js web framework, with a focus on clean structure and MVC oriented design patterns.

It is (admittedly!) heavily inspired by Ruby on Rails and Sinatra, two outstanding citizens in the Ruby web framework world.

## Creating an application

A new application can be created by running `maverick create project_name`. This command will create a directory containing a barebones project structure for a Maverick project.

## Running an application

You can run an application by executing `maverick server [MAVERICK_ENV=environment_name]` in the root of your application's directory. Passing the `MAVERICK_ENV` environment variable is optional, and defaults to "development".

This will launch a server in your terminal, and will output a range of useful information to the screen depending on the environment you're using.

## MVC

"MVC", or "Model, View, Controller", is the fundamental design pattern on which Maverick is based - so much so, it's even in the name! The framework is arhictected to ensure you have proper segmentation in your code and hence produce reusable and maintainable projects.

### Models

**Models** are the wrappers around your data, and the gatekeepers to your database. They house validations and callbacks that are performed during data operations, ensuring data integrity and well-formedness.

Models are currently not yet fully implemented in the Maverick framework, and hence are not documented yet. Please come back and check every so often!

### Controllers

**Controllers** are the grunt workers for your application. Their job is to fetch data from your Models (if needed) and pass them to the appropriate View for rendering to the client.

In Maverick, Controllers currently serve double duty: each method of a Controller is bound to a route, which is matched against an incomming request; if the route does match, the method will be invoked.

#### Creating controllers

Your Controllers are housed in the `app/controllers` folder, and should be named `entity_controller.js`, where entity is the pluralised name of the data the controller will be serving, eg. `students_controller.js` and `articles_controller.js`.

Controllers take a very simple form:

    Maverick.Controllers.Entity = new Maverick.Controller(function() {
      ...
    });

You must create a new instance of `Maverick.Controller`, or a subclass thereof, and push the resulting instance into the `Maverick.Controllers` collection. You should once again make sure the entity name is pluralized when pushing into `Maverick.Controllers`, eg. `Maverick.Controllers.Students` and `Maverick.Controllers.Articles`.

####

### Views

## Work In Progress

You've been warned: this is a work in progress, and literally so; as you are reading this, likely I am writing something new or doing something over again properly. Things that should work might not, and things that don't work will hopefully in the near future actually do something.

That said, please do feel free to contribute by raising issues if you spot something glaringly obvious. Over the coming months, I'll try to write up what I have in mind for this project, and will open the floodgates for other contributors and forks as soon as that has happened.

## License

At the moment, until I have everything written up properly in the way of coding styles and architectural plans, consider this copyright to me, Nathan Kleyn, with no licence for derivitives.
