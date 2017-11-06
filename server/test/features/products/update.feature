@Products @ProductsUpdate
Feature: Updating product information

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName          | strapline                    |
      | Product Update One | Automated subscription entry |
      | Product Update Two | Automated subscription entry |
    And there are the following "accounts" records in the database
      | identity                          | password | status | subscription               |
      | product-update-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |
      | product-update-two@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[2]._id }} |
    And there are the following "products" records in the database
      | subscription               | code                | displayName      | storePrice |
      | {{ subscriptions[1]._id }} | PRODUCT-UPDATE-0001 | Product Update A | 9          |
      | {{ subscriptions[1]._id }} | PRODUCT-UPDATE-0002 | Product Update B | 99         |
      | {{ subscriptions[1]._id }} | PRODUCT-UPDATE-0003 | Product Update C | 999        |
      | {{ subscriptions[2]._id }} | PRODUCT-UPDATE-0004 | Product Update D | 9999       |

  Scenario: If no update information is provided then the request is ignored
    Given I am logged in with the "product-update-one@venzra-test.io" account
    When I make an empty PATCH request to the API endpoint "/api/v1/products/{{ products[1]._id }}" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | _id       | slug             | code                | history  | displayName      | retailPrice | storePrice | status   | created   | updated   |
      | OBJECT_ID | product-update-a | PRODUCT-UPDATE-0001 | ARRAY[0] | Product Update A | 0           | 9          | INACTIVE | DATE_TIME | DATE_TIME |

  Scenario: Attempting to update a product that does not belong to the account subscription is rejected
    Given I am logged in with the "product-update-two@venzra-test.io" account
    When I make a PATCH request to the API endpoint "/api/v1/products/{{ products[1]._id }}" as "product" using:
      | op      | path   | value  |
      | replace | status | ACTIVE |
    Then the status returned from the "product" request should be a 404 error

  Scenario: Update product information with values provided which can be altered
    Given I am logged in with the "product-update-one@venzra-test.io" account
    When I make a PATCH request to the API endpoint "/api/v1/products/{{ products[1]._id }}" as "product" using:
      | op      | path        | value                |
      | replace | code        | PRODUCT-UPDATE-9999  |
      | replace | displayName | Product Update PATCH |
      | replace | retailPrice | 8                    |
      | replace | storePrice  | 5                    |
      | replace | status      | ACTIVE               |
      | replace | slug        | updated-slug         |
    Then there should be a 200 response from the "product" request that contains:
      | _id       | slug                 | code                | history  | displayName          | retailPrice | storePrice | status | created   | updated   |
      | OBJECT_ID | product-update-patch | PRODUCT-UPDATE-0001 | ARRAY[3] | Product Update PATCH | 8           | 5          | ACTIVE | DATE_TIME | DATE_TIME |
    And the "product" request that has a "history" field and row 1 contains:
      | _id       | account | field  | previous | next   | updated   |
      | OBJECT_ID | OBJECT  | status | INACTIVE | ACTIVE | DATE_TIME |
    And the "product" request that has a "history" field and row 2 contains:
      | _id       | account | field      | previous | next | updated   |
      | OBJECT_ID | OBJECT  | storePrice | "9"      | "5"  | DATE_TIME |
    And the "product" request that has a "history" field and row 3 contains:
      | _id       | account | field       | previous | next | updated   |
      | OBJECT_ID | OBJECT  | retailPrice | NIL      | "8"  | DATE_TIME |
