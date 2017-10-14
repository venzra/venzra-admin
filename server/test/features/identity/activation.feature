@Identity @IdentityActivate
Feature: Activation of a registered users account

  Scenario: Activate a registered user
    Given I make a POST request to the API endpoint "/api/v1/identity/activate" as "activation" using:
      | accountId | token    | password |
      | aaaaaaaa  | aaaaaaaa | Venzra$1 |
    Then The response from the "activation" request should be a 200 error that contains:
      | activation |
      | true       |
