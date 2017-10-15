@Identity @IdentityLogout
Feature: Perform a logout command that removes any account authentication token

  @Seed
  Scenario: Setup test data seed for feature
    Given There are the following "accounts" records in the database
      | identity                           | password               | status |
      | identity-logout-one@venzra-test.io | PASSWORD(VenzraTest$1) | ACTIVE |

  Scenario: Logging out an account that has previously logged in should be a success
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                           | password     |
      | identity-logout-one@venzra-test.io | VenzraTest$1 |
    When I make a POST request to the API endpoint "/api/v1/identity/logout" as "logout" using:
      | logout |
      | true   |
    Then The response from the "logout" request should be 200
    And There is a deleted cookie called "jwt" in the "logout" response header
