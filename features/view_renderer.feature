Feature: View Renderer
  In order to render views using the templating system of my choice
  As a developer
  I want to be able to instantiate a ViewRenderer object and have it render
  my views using a chosen templating library

  Scenario: Calling render and getting a rendered response
    Given I have a "Test" view renderer
    When I call the "Test" renderer with "a,b,c" as arguments
    Then the "Test" view renderer should be called
    And the "Test" view renderer should be passed "a,b,c"
