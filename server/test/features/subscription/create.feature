@Subscription @SubscriptionCreate
Feature: Creation of a new subscription

  @Seed
  Scenario: Setup test data seed for feature
    Given There are the following "accounts" records in the database
      | identity                               | password               | status |
      | subscription-create-one@venzra-test.io | PASSWORD(VenzraTest$1) | ACTIVE |

  Scenario: Required fields missing creates an error message

  Scenario: Setting subscription data requires a valid authentication
    When I make a POST request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | storeName                           |
      | Subscription Create Unauthenticated |
    Then The response from the "subscription" request should be a 401 error

  Scenario: Attach a subscription to an account starts in a trial state
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                               | password     |
      | subscription-create-one@venzra-test.io | VenzraTest$1 |
    When I make a POST request to the API endpoint "/api/v1/subscription" as "subscription" using:
      |  |
      |  |
    Then The response from the "subscription" request should be a 400 error that contains:
      | message           | detail                 |
      | Validation failed | ["storeName required"] |

  Scenario: Attach a subscription to an account starts in a trial state
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                               | password     |
      | subscription-create-one@venzra-test.io | VenzraTest$1 |
    When I make a POST request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | storeName               |
      | Subscription Create One |
    Then The response from the "subscription" request contains:
      | _id       | domainName              | status | storeName               |
      | OBJECT_ID | subscription-create-one | TRIAL  | Subscription Create One |
