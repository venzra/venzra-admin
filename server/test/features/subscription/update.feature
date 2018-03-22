@Subscription @SubscriptionUpdate
Feature: Updating a new subscription via patch requests

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName               | strapline                    |
      | Subscription Update One | Automated subscription entry |
    And there are the following "images" records in the database
      | subscription               | name                       | usage | size |
      | {{ subscriptions[1]._id }} | SubscriptionUpdate Image A | icon  | 1024 |
      | {{ subscriptions[1]._id }} | SubscriptionUpdate Image B | logo  | 1024 |
    And there are the following "accounts" records in the database
      | identity                               | password | status | subscription               |
      | subscription-update-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |

  Scenario: If no update information is provided then the request is ignored
    Given I am logged in with the "subscription-update-one@venzra-test.io" account
    When I make an empty PATCH request to the API endpoint "/api/subscription" as "subscription"
    Then there should be a 200 response from the "subscription" request that contains:
      | _id       | domainName              | storeName               | strapline                    | transactions                  | addons   | status |
      | OBJECT_ID | subscription-update-one | Subscription Update One | Automated subscription entry | { "base": 10, "rate": 0.046 } | ARRAY[0] | TRIAL  |

  Scenario: It should not be possible to set an empty store name value
    Given I am logged in with the "subscription-update-one@venzra-test.io" account
    When I make a PATCH request to the API endpoint "/api/subscription" as "subscription" using:
      | op      | path      | value |
      | replace | storeName |       |
    Then there should be a 400 error from the "subscription" request that contains:
      | message           | detail                 |
      | Validation failed | ["storeName required"] |

  Scenario: Store name should be at least 3 characters
    Given I am logged in with the "subscription-update-one@venzra-test.io" account
    When I make a PATCH request to the API endpoint "/api/subscription" as "subscription" using:
      | op      | path      | value |
      | replace | storeName | xx    |
    Then there should be a 400 error from the "subscription" request that contains:
      | message           | detail                  |
      | Validation failed | ["storeName minlength"] |

  Scenario: Update an existing account subscription record
    Given I am logged in with the "subscription-update-one@venzra-test.io" account
    When I make a PATCH request to the API endpoint "/api/subscription" as "subscription" using:
      | op      | path      | value                       |
      | replace | storeName | Subscription Update Updated |
      | replace | strapline | Updated subscription entry  |
      | replace | icon      | {{ images[1]._id }}         |
      | replace | logo      | {{ images[2]._id }}         |
      | replace | theme     | { "color": "Orange" }       |
    Then there should be a 200 response from the "subscription" request that contains:
      | _id       | domainName                  | storeName                   | strapline                  | icon                | logo                | theme  | transactions                  | addons   | status |
      | OBJECT_ID | subscription-update-updated | Subscription Update Updated | Updated subscription entry | {{ images[1]._id }} | {{ images[2]._id }} | OBJECT | { "base": 10, "rate": 0.046 } | ARRAY[0] | TRIAL  |
    And the response path "theme" from the "subscription" request contains:
      | color  |
      | orange |
