@Subscription @SubscriptionGateway
Feature: Creation of a new subscription gateway

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName               | status |
      | Subscription Create One | TRIAL  |
    And there are the following "accounts" records in the database
      | identity                               | password | subscription               | status |
      | subscription-create-one@venzra-test.io | PASSWORD | {{ subscriptions[1]._id }} | ACTIVE |

  Scenario: A missing email and stripe bank token will result in an error
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    When I make an empty POST request to the API endpoint "/api/v1/gateway" as "gateway"
    Then there should be a 400 error from the "gateway" request that contains:
      | message           | detail                               |
      | Validation failed | ["email required", "token required"] |

  Scenario: Handle a rejection from stripe occurring when attempting to create a subscription
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    And there is a POST consumer at "https://api.stripe.com" for "/v1/accounts" that will return "stripe/accounts/create-invalid.json" with status 400
    When I make a POST request to the API endpoint "/api/v1/gateway" as "gateway" using:
      | email                                      | token                       |
      | subscription-create-success@venzra-test.io | { "id": "btok_xxxxxxxxxx" } |
    Then there should be a 500 error from the "gateway" request that contains:
      | message                                                    |
      | An external error has occurred - StripeInvalidRequestError |

  Scenario: Sending a valid request will create subscription payment data
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    And there is a POST consumer at "https://api.stripe.com" for "/v1/accounts" that will return "stripe/accounts/create-success.json" with status 200
    When I make a POST request to the API endpoint "/api/v1/gateway" as "gateway" using:
      | email                                      | token                       |
      | subscription-create-success@venzra-test.io | { "id": "btok_xxxxxxxxxx" } |
    Then there should be a 200 response from the "gateway" request that contains:
      | _id       | domainName              | storeName               | gateway | status |
      | OBJECT_ID | subscription-create-one | Subscription Create One | OBJECT  | TRIAL  |
    And the response path "gateway" from the "gateway" request contains:
      | account         | bank     |
      | acct_xxxxxxxxxx | ARRAY[1] |
    And the response path "gateway.bank" from the "gateway" request contains:
      | name             | holder      | number | sortCode | created   |
      | STRIPE TEST BANK | Jane Austen | "6789" | "108800" | DATE_TIME |

  Scenario: Sending a second request will not call to stripe or change / overwrite subscription information
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    When I make a POST request to the API endpoint "/api/v1/gateway" as "gateway" using:
      | email                                      | token                       |
      | subscription-create-success@venzra-test.io | { "id": "btok_xxxxxxxxxx" } |
    Then there should be a 200 response from the "gateway" request that contains:
      | _id       | domainName              | storeName               | gateway | status |
      | OBJECT_ID | subscription-create-one | Subscription Create One | OBJECT  | TRIAL  |
    And the response path "gateway" from the "gateway" request contains:
      | account         | bank     |
      | acct_xxxxxxxxxx | ARRAY[1] |
