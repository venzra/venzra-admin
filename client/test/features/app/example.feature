@Example
Feature: Example feature file

  Scenario: Check the site loads
    Given I navigate to the "/" page
    Then the browser title should be "Login :: Venzra"
