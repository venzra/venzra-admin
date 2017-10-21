@Identity @IdentityLogin
Feature: Ability for a user to authenticate and gain a login token to use the API further

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "accounts" records in the database
      | identity                            | password | status     |
      | identity-login-one@venzra-test.io   | PASSWORD | REGISTERED |
      | identity-login-two@venzra-test.io   | PASSWORD | RECOVERY   |
      | identity-login-three@venzra-test.io | PASSWORD | ACTIVE     |
      | identity-login-four@venzra-test.io  | PASSWORD | LOCKED     |

  Scenario: Login without credentials
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      |  |
      |  |
    Then the response from the "login" request should be 401
    And the response from the "login" request contains:
      | message                  |
      | Invalid user credentials |

  Scenario: Login with an UNKNOWN account
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                       | password     |
      | unknown-account@venzra-test.io | VenzraTest$1 |
    Then the response from the "login" request should be 401
    And the response from the "login" request contains:
      | message                  |
      | Invalid user credentials |

  Scenario: Login with a REGISTERED account
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                          | password     |
      | identity-login-one@venzra-test.io | VenzraTest$1 |
    Then the response from the "login" request should be 401
    And the response from the "login" request contains:
      | message                  |
      | Invalid user credentials |

  Scenario: Login with a RECOVERY account
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                          | password     |
      | identity-login-two@venzra-test.io | VenzraTest$1 |
    Then the response from the "login" request should be 200
    And there is a cookie called "jwt" in the "login" response header

  Scenario: Login with an ACTIVE account
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                            | password     |
      | identity-login-three@venzra-test.io | VenzraTest$1 |
    Then the response from the "login" request should be 200
    And there is a cookie called "jwt" in the "login" response header

  Scenario: Incorrect password with an ACTIVE account
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                            | password          |
      | identity-login-three@venzra-test.io | IncorrectPassword |
    Then the response from the "login" request should be 401
    And the response from the "login" request contains:
      | message                  |
      | Invalid user credentials |

  Scenario: Login with a LOCKED account
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                           | password     |
      | identity-login-four@venzra-test.io | VenzraTest$1 |
    Then the response from the "login" request should be 401
    And the response from the "login" request contains:
      | message                  |
      | Invalid user credentials |
