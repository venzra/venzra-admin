@Subscription @SubscriptionUpdate
Feature: Updating a new subscription via patch requests

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName               | strapline                    |
      | Subscription Update One | Automated subscription entry |
    And there are the following "accounts" records in the database
      | identity                               | password | status | subscription               |
      | subscription-update-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |

  Scenario: If no update information is provided then the request is ignored
    Given I am logged in with the "subscription-update-one@venzra-test.io" account
    When I make an empty PATCH request to the API endpoint "/api/v1/subscription" as "subscription"
    Then the response from the "subscription" request contains:
      | _id       | domainName              | status | storeName               | strapline                    |
      | OBJECT_ID | subscription-update-one | TRIAL  | Subscription Update One | Automated subscription entry |

  Scenario: It should not be possible to set an empty store name value
    Given I am logged in with the "subscription-update-one@venzra-test.io" account
    When I make a PATCH request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | op      | path      | value |
      | replace | storeName |       |
    Then the response from the "subscription" request should be a 400 error that contains:
      | message           | detail                 |
      | Validation failed | ["storeName required"] |


  Scenario: Update an existing account subscription record
    Given I am logged in with the "subscription-update-one@venzra-test.io" account
    When I make a PATCH request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | op      | path      | value                       |
      | replace | storeName | Subscription Update Updated |
      | replace | strapline | Updated subscription entry  |
    Then the response from the "subscription" request contains:
      | _id       | domainName                  | status | storeName                   | strapline                  |
      | OBJECT_ID | subscription-update-updated | TRIAL  | Subscription Update Updated | Updated subscription entry |
