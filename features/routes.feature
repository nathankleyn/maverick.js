Feature: Routes
  In order to selectively run actions on a specific URL
  As a developer
  I want to be able to associate controller actions with routes

  Scenario: Create a controller with a "get" route
    Given I have a new controller
    When I add a "get" action for the route "/"
    And I load the controller
    Then the controller should have a "get" route

  Scenario: Create a controller with a "post" route
    Given I have a new controller
    When I add a "post" action for the route "/"
    And I load the controller
    Then the controller should have a "post" route

  Scenario: Create a controller with a "put" route
    Given I have a new controller
    When I add a "put" action for the route "/"
    And I load the controller
    Then the controller should have a "put" route

  Scenario: Create a controller with a "delete" route
    Given I have a new controller
    When I add a "delete" action for the route "/"
    And I load the controller
    Then the controller should have a "delete" route

  Scenario: Create a route with a named parameter
    Given I have a new controller
    When I add a "get" action for the route "/hello/:place"
    And I load the controller
    And I trigger the route "/hello/world"
    Then the action should be triggered
    And there should be an "place" param with the value "world"

  Scenario: Create a router with a wildcard parameter
    Given I have a new controller
    When I add a "get" action for the route "/hi/*"
    And I load the controller
    And I trigger the route "/hi/world"
    Then the action should be triggered
    And there should be no params

