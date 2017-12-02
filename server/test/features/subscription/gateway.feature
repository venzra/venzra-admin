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
      | message           | detail                                                                                                                              |
      | Validation failed | ["forename required", "surname required", "company required", "email required", "legal required", "dob required", "token required"] |

  Scenario: Handle a rejection from stripe occurring when attempting to create a subscription
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    And there is a POST consumer at "https://api.stripe.com" for "/v1/accounts" that will return "stripe/accounts/create-invalid.json" with status 400
    When I make a POST request to the API endpoint "/api/v1/gateway" as "gateway" using:
      | forename | surname | company             | email                                      | dob                                      | legal                                                                                               | token                       |
      | John     | Smith   | Subscription Create | subscription-create-success@venzra-test.io | { "day": 31, "month": 12, "year": 1980 } | { "building": 1, "street": "Street", "city": "City", "county": "County", "postalCode": "PO57 3OX" } | { "id": "btok_xxxxxxxxxx" } |
    Then there should be a 500 error from the "gateway" request that contains:
      | message                        |
      | No such token: btok_xxxxxxxxxx |

  Scenario: Sending a valid request will create subscription payment data
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    And there is a POST consumer at "https://api.stripe.com" for "/v1/accounts" that will return "stripe/accounts/create-success.json" with status 200
    When I make a POST request to the API endpoint "/api/v1/gateway" as "gateway" using:
      | forename | surname | company             | email                                      | dob                                      | legal                                                                                               | token                       |
      | John     | Smith   | Subscription Create | subscription-create-success@venzra-test.io | { "day": 31, "month": 12, "year": 1980 } | { "building": 1, "street": "Street", "city": "City", "county": "County", "postalCode": "po57 3ox" } | { "id": "btok_xxxxxxxxxx" } |
    Then there should be a 200 response from the "gateway" request that contains:
      | _id       | domainName              | storeName               | gateway | status |
      | OBJECT_ID | subscription-create-one | Subscription Create One | OBJECT  | ACTIVE |
    And the response path "gateway" from the "gateway" request contains:
      | account         | entity | address | bank     | modified  |
      | acct_xxxxxxxxxx | OBJECT | OBJECT  | ARRAY[1] | DATE_TIME |
    And the response path "gateway.entity" from the "gateway" request contains:
      | forename | surname | email                                      | dob                      |
      | John     | Smith   | subscription-create-success@venzra-test.io | 1980-12-31T00:00:00.000Z |
    And the response path "gateway.address" from the "gateway" request contains:
      | company             | building | street | city | county | postalCode | country |
      | Subscription Create | 1        | Street | City | County | PO573OX    | GB      |
    And the response path "gateway.bank" from the "gateway" request contains:
      | name             | holder      | number | sortCode   |
      | STRIPE TEST BANK | Jane Austen | "2345" | "10-88-00" |


  Scenario: Sending a second request will not call to stripe or change / overwrite subscription information
    Given I am logged in with the "subscription-create-one@venzra-test.io" account
    When I make a POST request to the API endpoint "/api/v1/gateway" as "gateway" using:
      | forename | surname | company             | email                                      | dob                                      | legal                                                                                               | token                       |
      | John     | Smith   | Subscription Create | subscription-create-success@venzra-test.io | { "day": 31, "month": 12, "year": 1980 } | { "building": 1, "street": "Street", "city": "City", "county": "County", "postalCode": "PO57 3OX" } | { "id": "btok_xxxxxxxxxx" } |
    Then there should be a 200 response from the "gateway" request that contains:
      | _id       | domainName              | storeName               | gateway | status |
      | OBJECT_ID | subscription-create-one | Subscription Create One | OBJECT  | ACTIVE |
    And the response path "gateway" from the "gateway" request contains:
      | account         | entity | address | bank     | modified  |
      | acct_xxxxxxxxxx | OBJECT | OBJECT  | ARRAY[1] | DATE_TIME |
    And the response path "gateway.entity" from the "gateway" request contains:
      | forename | surname | email                                      | dob                      |
      | John     | Smith   | subscription-create-success@venzra-test.io | 1980-12-31T00:00:00.000Z |
    And the response path "gateway.address" from the "gateway" request contains:
      | company             | building | street | city | county | postalCode | country |
      | Subscription Create | 1        | Street | City | County | PO573OX    | GB      |
    And the response path "gateway.bank" from the "gateway" request contains:
      | name             | holder      | number | sortCode   |
      | STRIPE TEST BANK | Jane Austen | "2345" | "10-88-00" |
