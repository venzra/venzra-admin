@Subscription @SubscriptionUpdate
Feature: Creation of a new subscription

  @Seed
  Scenario: Setup test data seed for feature
    Given There are the following "subscriptions" records in the database
      | storeName               | strapline                    |
      | Subscription Update One | Automated subscription entry |
    And There are the following "accounts" records in the database
      | identity                               | password               | status | subscription               |
      | subscription-update-one@venzra-test.io | PASSWORD(VenzraTest$1) | ACTIVE | {{ subscriptions[1]._id }} |

  Scenario: Update an existing account subscription record
    Given I make a POST request to the API endpoint "/api/v1/identity/login" as "login" using:
      | identity                               | password     |
      | subscription-update-one@venzra-test.io | VenzraTest$1 |
    When I make a POST request to the API endpoint "/api/v1/subscription" as "subscription" using:
      | storeName                   | strapline                  |
      | Subscription Update Updated | Updated subscription entry |
    Then The response from the "subscription" request contains:
      | _id       | domainName                  | status | storeName                   | strapline                  |
      | OBJECT_ID | subscription-update-updated | TRIAL  | Subscription Update Updated | Updated subscription entry |
