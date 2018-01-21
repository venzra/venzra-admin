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
    And there are the following "images" records in the database
      | subscription               | name                   | usage   | size |
      | {{ subscriptions[1]._id }} | ProductsSearch Image A | feature | 1024 |
      | {{ subscriptions[1]._id }} | ProductsSearch Image B | feature | 4096 |
      | {{ subscriptions[2]._id }} | ProductsSearch Image C | feature | 2048 |
    And there are the following "products" records in the database in series
      | subscription               | code          | displayName        | featureImage        | promotionalImage    | currentPrice | status   |
      | {{ subscriptions[1]._id }} | SEARCH-01-001 | Product Search A   | {{ images[1]._id }} | {{ images[2]._id }} | 9            | ACTIVE   |
      | {{ subscriptions[1]._id }} | SEARCH-01-002 | Product Search AA  | {{ images[1]._id }} | {{ images[2]._id }} | 99           | ACTIVE   |
      | {{ subscriptions[1]._id }} | SEARCH-01-003 | Product Search AAA | {{ images[1]._id }} | {{ images[2]._id }} | 999          | ACTIVE   |
      | {{ subscriptions[1]._id }} | SEARCH-01-004 | Product Search B   | {{ images[1]._id }} | {{ images[2]._id }} | 6            | ACTIVE   |
      | {{ subscriptions[1]._id }} | SEARCH-01-005 | Product Search BB  | {{ images[1]._id }} | {{ images[2]._id }} | 66           | ACTIVE   |
      | {{ subscriptions[1]._id }} | SEARCH-01-006 | Product Search C   | {{ images[1]._id }} | {{ images[2]._id }} | 0            | INACTIVE |
      | {{ subscriptions[1]._id }} | SEARCH-01-007 | Product Search D   | {{ images[2]._id }} | {{ images[2]._id }} | 1000         | ACTIVE   |
      | {{ subscriptions[1]._id }} | SEARCH-01-008 | Product Search E   | {{ images[2]._id }} | {{ images[2]._id }} | 2000         | ACTIVE   |
      | {{ subscriptions[1]._id }} | SEARCH-01-009 | Product Search F   | {{ images[2]._id }} | {{ images[2]._id }} | 3000         | INACTIVE |
      | {{ subscriptions[1]._id }} | SEARCH-01-010 | Product Search G   | {{ images[2]._id }} | {{ images[1]._id }} | 5            | INACTIVE |
      | {{ subscriptions[1]._id }} | SEARCH-01-011 | Product Search GG  | {{ images[2]._id }} | {{ images[1]._id }} | 50           | INACTIVE |
      | {{ subscriptions[1]._id }} | SEARCH-01-012 | Product Search GGG | {{ images[2]._id }} | {{ images[1]._id }} | 500          | ACTIVE   |
      | {{ subscriptions[2]._id }} | SEARCH-02-001 | Product Search A   | {{ images[3]._id }} | {{ images[3]._id }} | 3            | ACTIVE   |
      | {{ subscriptions[2]._id }} | SEARCH-02-002 | Product Search B   | {{ images[3]._id }} | {{ images[3]._id }} | 33           | ACTIVE   |
      | {{ subscriptions[2]._id }} | SEARCH-02-003 | Product Search C   | {{ images[3]._id }} | {{ images[3]._id }} | 333          | ACTIVE   |

  Scenario: Requesting a list of products should return only records for that subscription (subscription one)
    Given I am logged in with the "products-search-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list      | total | skip | limit |
      | ARRAY[12] | 12    | 0    | 20    |
    And the "product" request that has a "list" field and row 1 contains:
      | _id       | slug               | code          | displayName        | promotionalImage    | currentPrice | status | created   |
      | OBJECT_ID | product-search-ggg | SEARCH-01-012 | Product Search GGG | {{ images[1]._id }} | 500          | ACTIVE | DATE_TIME |

  Scenario: Requesting a list of products should return only records for that subscription (subscription two)
    Given I am logged in with the "products-search-two@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[3] | 3     | 0    | 20    |
    And the "product" request that has a "list" field and row 1 contains:
      | _id       | slug             | code          | displayName      | promotionalImage    | currentPrice | status | created   |
      | OBJECT_ID | product-search-c | SEARCH-02-003 | Product Search C | {{ images[3]._id }} | 333          | ACTIVE | DATE_TIME |

  Scenario: Requesting a list of products adheres to pagination values for skip and limit
    Given I am logged in with the "products-search-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products?skip=2&limit=3" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[3] | 12    | 2    | 3     |
    And the "product" request that has a "list" field and row 1 contains:
      | _id       | slug             | code          | displayName      | promotionalImage    | currentPrice | status   | created   |
      | OBJECT_ID | product-search-g | SEARCH-01-010 | Product Search G | {{ images[1]._id }} | 5            | INACTIVE | DATE_TIME |

  Scenario: Filtering product results by code returns based on partial matching
    Given I am logged in with the "products-search-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products?search=01-01" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[3] | 3     | 0    | 20    |
    And the response from the "product" request has a "list" that contains rows:
      | _id                    | code          |
      | {{ products[12]._id }} | SEARCH-01-012 |
      | {{ products[11]._id }} | SEARCH-01-011 |
      | {{ products[10]._id }} | SEARCH-01-010 |

  Scenario: Filtering product results by status
    Given I am logged in with the "products-search-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products?status=INACTIVE" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[4] | 4     | 0    | 20    |
    And the response from the "product" request has a "list" that contains rows:
      | _id                    | code          | status   |
      | {{ products[11]._id }} | SEARCH-01-011 | INACTIVE |
      | {{ products[10]._id }} | SEARCH-01-010 | INACTIVE |
      | {{ products[9]._id }}  | SEARCH-01-009 | INACTIVE |
      | {{ products[6]._id }}  | SEARCH-01-006 | INACTIVE |

  Scenario: Sorting product results in reverse
    Given I am logged in with the "products-search-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products?direction=asc" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list      | total | skip | limit |
      | ARRAY[12] | 12    | 0    | 20    |
    And the response from the "product" request has a "list" that contains rows:
      | _id                   | code          |
      | {{ products[1]._id }} | SEARCH-01-001 |
      | {{ products[2]._id }} | SEARCH-01-002 |
      | {{ products[3]._id }} | SEARCH-01-003 |

  Scenario: Sorting product results by another column than the default
    Given I am logged in with the "products-search-two@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products?sort=displayName" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[3] | 3     | 0    | 20    |
    And the response from the "product" request has a "list" that contains rows:
      | _id                    | code          | displayName      |
      | {{ products[13]._id }} | SEARCH-02-001 | Product Search A |
      | {{ products[14]._id }} | SEARCH-02-002 | Product Search B |
      | {{ products[15]._id }} | SEARCH-02-003 | Product Search C |

  Scenario: Sorting product results by another column than the default
    Given I am logged in with the "products-search-two@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products?sort=currentPrice&direction=desc" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[3] | 3     | 0    | 20    |
    And the response from the "product" request has a "list" that contains rows:
      | _id                    | code          | currentPrice |
      | {{ products[15]._id }} | SEARCH-02-003 | 333          |
      | {{ products[14]._id }} | SEARCH-02-002 | 33           |
      | {{ products[13]._id }} | SEARCH-02-001 | 3            |

  Scenario: Requesting a list of products should return no results when there are no products (subscription three)
    Given I am logged in with the "products-search-three@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | list     | total | skip | limit |
      | ARRAY[0] | 0     | 0    | 20    |
