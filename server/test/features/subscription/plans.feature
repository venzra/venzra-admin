@Subscription @SubscriptionPlans
Feature: Creation of a new subscription payment

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName              | status |
      | Subscription Plans One | TRIAL  |
    And there are the following "accounts" records in the database
      | identity                              | password | subscription               | status |
      | subscription-plans-one@venzra-test.io | PASSWORD | {{ subscriptions[1]._id }} | ACTIVE |
    And there are the following "plans" records in the database
      | reference          | name                 | currency | price | interval | frequency |
      | SubscriptionPlansA | Subscription Plans A | gbp      | 100   | 2        | week      |
      | SubscriptionPlansB | Subscription Plans B | eur      | 110   | 1        | month     |
      | SubscriptionPlansC | Subscription Plans C | usd      | 120   | 5        | day       |

  Scenario: Retrieve a list of plans
    Given I am logged in with the "subscription-plans-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/v1/plans" as "plans"
    Then there should be a 200 response from the "plans" request that contains:
      | list     | total |
      | ARRAY[3] | 3     |
    And there should be a 200 response from the "plans" request that has a "list" field and row 1 contains:
      | _id       | reference          | name                 | currency | price | interval | frequency |
      | OBJECT_ID | SubscriptionPlansA | Subscription Plans A | gbp      | 100   | 2        | week      |
    And there should be a 200 response from the "plans" request that has a "list" field and row 2 contains:
      | _id       | reference          | name                 | currency | price | interval | frequency |
      | OBJECT_ID | SubscriptionPlansB | Subscription Plans B | eur      | 110   | 1        | month     |
    And there should be a 200 response from the "plans" request that has a "list" field and row 3 contains:
      | _id       | reference          | name                 | currency | price | interval | frequency |
      | OBJECT_ID | SubscriptionPlansC | Subscription Plans C | usd      | 120   | 5        | day       |
