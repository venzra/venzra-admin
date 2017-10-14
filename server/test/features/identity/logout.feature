@Identity @IdentityLogin
Feature: Access a list of plans that a user will be able to subscribe to after registration

  Scenario: Required fields missing should result in an error occurring
    Given I make a POST request to the API endpoint "/api/v1/identity/logout" as "logout" using:
      | logout |
      | true   |
    Then The response from the "logout" request should be a 200 error that contains:
      | logout |
      | true   |
