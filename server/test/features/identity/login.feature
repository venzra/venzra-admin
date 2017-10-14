@Identity @IdentityLogin
Feature: Ability for a user to authenticate and gain a login token to use the API further

  Scenario: Login with a valid account
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity         | password |
      | active@venzra.io | Venzra$1 |
    Then The response from the "login" request should be a 200 error that contains:
      | login |
      | true  |
