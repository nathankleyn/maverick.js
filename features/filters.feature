Feature: Filters
  In order to have callbacks for controller action events
  As a developer
  I want to be able to execute code before, around and after controller actions

  Scenario: Adding a before filter
    Given that I have a controller action for the route "/"
    And I have a "before" filter for the route "/"
    When I trigger the route "/"
    Then the "before" filter for the route "/" should be triggered
    And the action for the route "/" should be triggered

  Scenario: Adding an after filter
    Given that I have a controller action for the route "/"
    And I have an "after" filter for the route "/"
    When I trigger the route "/"
    Then the "after" filter for the route "/" should be triggered
    And the action for the route "/" should be triggered

  Scenario: Adding an around filter that executes the action
    Given that I have a controller action for the route "/"
    And I have an "around" filter for the route "/" that executes the action
    When I trigger the route "/"
    Then the "around" filter for the route "/" should be triggered
    And the action for the route "/" should be triggered

  Scenario: Adding an around filter that does not execute the action
    Given that I have a controller action for the route "/"
    And I have an "around" filter for the route "/" that does not execute the action
    When I trigger the route "/"
    Then the "around" filter for the route "/" should be triggered
    And the action for the route "/" should not be triggered
