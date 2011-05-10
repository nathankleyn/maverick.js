Feature: Server
  In order to serve responses to incoming requests
  As a developer
  I want a server to start on a given port and host and respond to HTTP requests with data I provide to it

  Scenario: Starting the server
    Given I have a new instance of the server with port "8000"
    When I trigger a request
    Then a server should be running
    And a server should be listening on port 8000

  Scenario: Triggering a server response
    Given I have a new instance of the server with port "8000"
