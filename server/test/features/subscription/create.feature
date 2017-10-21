@Subscription @SubscriptionCreate
Feature: Creation of a new subscription

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName               | status |
      | Subscription Create One | TRIAL  |
    And there are the following "accounts" records in the database
      | identity                               | password | status | subscription               |
      | subscription-create-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |

  Scenario: A missing email and stripe bank token will result in an error
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    When I make an empty POST request to the API endpoint "/api/v1/subscription" as "subscription"
    Then the response from the "subscription" request should be a 400 error that contains:
      | message           | detail                               |
      | Validation failed | ["email required", "token required"] |

  Scenario: Handle a rejection from stripe occurring when attempting to create a subscription
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    And there is a POST consumer at "https://api.stripe.com" for "/v1/accounts" that will return "stripe/accounts/create-invalid.json" with status 400
    When I make a POST request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | email                                      | token                       |
      | subscription-create-success@venzra-test.io | { "id": "btok_xxxxxxxxxx" } |
    Then the response from the "subscription" request should be a 502 error that contains:
      | message                                                    |
      | An external error has occurred - StripeInvalidRequestError |

  Scenario: Sending a valid request will create subscription payment data
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    And there is a POST consumer at "https://api.stripe.com" for "/v1/accounts" that will return "stripe/accounts/create-success.json" with status 200
    When I make a POST request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | email                                      | token                       |
      | subscription-create-success@venzra-test.io | { "id": "btok_xxxxxxxxxx" } |
    Then the response from the "subscription" request contains:
      | _id       | domainName              | status | storeName               | stripe |
      | OBJECT_ID | subscription-create-one | TRIAL  | Subscription Create One | OBJECT |
    Then the response path "stripe" from the "subscription" request contains:
      | account         | bank  |
      | acct_xxxxxxxxxx | ARRAY |
    Then the response path "stripe.bank" from the "subscription" request contains:
      | name             | holder      | number | sortCode | created   |
      | STRIPE TEST BANK | Jane Austen | "6789" | "108800" | DATE_TIME |

  Scenario: Sending a second request will not call to stripe or change / overwrite subscription information
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    When I make a POST request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | email                                      | token                       |
      | subscription-create-success@venzra-test.io | { "id": "btok_xxxxxxxxxx" } |
    Then the response from the "subscription" request contains:
      | _id       | domainName              | status | storeName               | stripe |
      | OBJECT_ID | subscription-create-one | TRIAL  | Subscription Create One | OBJECT |
    Then the response path "stripe" from the "subscription" request contains:
      | account         | bank  |
      | acct_xxxxxxxxxx | ARRAY |
