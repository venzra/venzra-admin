@Products @ProductsSearch
Feature: Creation of a new product entry

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName             | status |
      | Products Search One   | ACTIVE |
      | Products Search Two   | ACTIVE |
      | Products Search Three | ACTIVE |
    And there are the following "accounts" records in the database
      | identity                             | password | status | subscription               |
      | products-search-one@venzra-test.io   | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |
      | products-search-two@venzra-test.io   | PASSWORD | ACTIVE | {{ subscriptions[2]._id }} |
      | products-search-three@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[3]._id }} |
    And there are the following "products" records in the database
      | subscription               | code          | name               | price | status    |
      | {{ subscriptions[1]._id }} | SEARCH-01-001 | Product Search A   | 9     | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-002 | Product Search AA  | 99    | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-003 | Product Search AAA | 999   | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-004 | Product Search B   | 6     | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-005 | Product Search BB  | 66    | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-006 | Product Search C   | 0     | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-007 | Product Search D   | 1000  | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-008 | Product Search E   | 2000  | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-009 | Product Search F   | 3000  | DRAFT     |
      | {{ subscriptions[1]._id }} | SEARCH-01-010 | Product Search G   | 5     | DRAFT     |
      | {{ subscriptions[1]._id }} | SEARCH-01-011 | Product Search GG  | 50    | AVAILABLE |
      | {{ subscriptions[1]._id }} | SEARCH-01-012 | Product Search GGG | 500   | WITHDRAWN |
      | {{ subscriptions[2]._id }} | SEARCH-02-001 | Product Search A   | 999   | AVAILABLE |
      | {{ subscriptions[2]._id }} | SEARCH-02-002 | Product Search B   | 999   | AVAILABLE |
      | {{ subscriptions[2]._id }} | SEARCH-02-003 | Product Search C   | 999   | AVAILABLE |

  Scenario: Requesting a list of products should return only records for that subscription (subscription one)
    Given I am logged in with the "products-search-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/v1/products" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list      | total | skip | limit |
      | ARRAY[12] | 12    | 0    | 25    |
    And the "product" request that has a list and row 1 contains:
      | _id       | slug             | code          | name             | price | status    |
      | OBJECT_ID | product-search-a | SEARCH-01-001 | Product Search A | 9     | AVAILABLE |

  Scenario: Requesting a list of products should return only records for that subscription (subscription two)
    Given I am logged in with the "products-search-two@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/v1/products" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[3] | 3     | 0    | 25    |
    And the "product" request that has a list and row 1 contains:
      | _id       | slug             | code          | name             | price | status    |
      | OBJECT_ID | product-search-a | SEARCH-02-001 | Product Search A | 999   | AVAILABLE |

  Scenario: Requesting a list of products should return no results when there are no products (subscription three)
    Given I am logged in with the "products-search-three@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/v1/products" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[0] | 0     | 0    | 25    |
