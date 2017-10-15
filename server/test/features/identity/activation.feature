@Identity @IdentityActivation
Feature: Activation of a registered users account

  @Seed
  Scenario: Setup test data seed for feature
    Given There are the following "accounts" records in the database
      | identity                               | validation                                                       |
      | identity-activation-one@venzra-test.io | {"key":"aaaabbbbccccdddd", "expires":"2050-09-18T00:00:00.000Z"} |
      | identity-activation-two@venzra-test.io | {"key":"aaaabbbbccccdddd", "expires":"1980-09-18T00:00:00.000Z"} |

  Scenario: An incorrect account reference should return an error message
    Given I make a POST request to the API endpoint "/api/v1/identity/activate" as "activation" using:
      | _id                      | password     | token            |
      | 000000000000000000000000 | VenzraTest$1 | aaaabbbbccccdddd |
    Then The response from the "activation" request should be a 400 error that contains:
      | message                     |
      | Invalid account credentials |

  Scenario: An expired token should no longer allow activation to occur
    Given I make a POST request to the API endpoint "/api/v1/identity/activate" as "activation" using:
      | _id                   | password     | token            |
      | {{ accounts[2]._id }} | VenzraTest$1 | aaaabbbbccccdddd |
    Then The response from the "activation" request should be a 400 error that contains:
      | message                     |
      | Invalid account credentials |

  Scenario: An incorrect validation token should not allow activation to occur
    Given I make a POST request to the API endpoint "/api/v1/identity/activate" as "activation" using:
      | _id                   | password     | token            |
      | {{ accounts[1]._id }} | VenzraTest$1 | ddddccccbbbbaaaa |
    Then The response from the "activation" request should be a 400 error that contains:
      | message                     |
      | Invalid account credentials |

  Scenario: Activate a registered user
    Given I make a POST request to the API endpoint "/api/v1/identity/activate" as "activation" using:
      | _id                   | password     | token            |
      | {{ accounts[1]._id }} | VenzraTest$1 | aaaabbbbccccdddd |
    Then The response from the "activation" request should be 202
