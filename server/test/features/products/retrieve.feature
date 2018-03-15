@Products @ProductsRetrieve
Feature: Retrieve information for a product

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName             | status |
      | Products Retrieve One | ACTIVE |
      | Products Retrieve Two | ACTIVE |
    And there are the following "accounts" records in the database
      | identity                             | password | status | subscription               |
      | products-retrieve-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |
      | products-retrieve-two@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[2]._id }} |
    And there are the following "categories" records in the database
      | subscription               | name                | description           | primary |
      | {{ subscriptions[1]._id }} | Products Retrieve A | Automated description | true    |
      | {{ subscriptions[1]._id }} | Products Retrieve B | Automated description | false   |
      | {{ subscriptions[2]._id }} | Products Retrieve A | Automated description | false   |
    And the following "categories" records are updated in the database
      | _id                     | parent                  | children                    |
      | {{ categories[1]._id }} | null                    | ["{{ categories[2]._id }}"] |
      | {{ categories[2]._id }} | {{ categories[1]._id }} | []                          |
    And there are the following "images" records in the database
      | subscription               | name                     | usage   | size |
      | {{ subscriptions[1]._id }} | ProductsRetrieve Image A | feature | 1024 |
      | {{ subscriptions[1]._id }} | ProductsRetrieve Image B | feature | 4096 |
      | {{ subscriptions[2]._id }} | ProductsRetrieve Image C | feature | 2048 |
    And there are the following "products" records in the database in series
      | subscription               | code            | displayName        | description           | featureImage        | promotionalImage    | currentPrice | categories                  | status |
      | {{ subscriptions[1]._id }} | RETRIEVE-01-001 | Product Retrieve A | Automated Description | {{ images[1]._id }} | {{ images[2]._id }} | 9            | ["{{ categories[2]._id }}"] | ACTIVE |
      | {{ subscriptions[1]._id }} | RETRIEVE-01-002 | Product Retrieve B | Automated Description | {{ images[1]._id }} | {{ images[2]._id }} | 99           | ["{{ categories[2]._id }}"] | ACTIVE |
      | {{ subscriptions[2]._id }} | RETRIEVE-02-001 | Product Retrieve A | Automated Description | {{ images[3]._id }} | {{ images[3]._id }} | 3            | []                          | ACTIVE |

  Scenario: Retrieval of a product contains correct data
    Given I am logged in with the "products-retrieve-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products/{{ products[1]._id }}" as "product"
    Then there should be a 200 response from the "product" request that contains:
      | _id       | slug               | code            | displayName        | description           | featureImage        | promotionalImage    | previousPrice | currentPrice | categories | history  | status | created   | updated   |
      | OBJECT_ID | product-retrieve-a | RETRIEVE-01-001 | Product Retrieve A | Automated Description | {{ images[1]._id }} | {{ images[2]._id }} | 0             | 9            | ARRAY[1]   | ARRAY[0] | ACTIVE | DATE_TIME | DATE_TIME |
    And the response path "categories" from the "product" request contains:
      | _id                     | name                | parent                                                              |
      | {{ categories[2]._id }} | Products Retrieve B | { "_id": "{{ categories[1]._id }}", "name": "Products Retrieve A" } |

  Scenario: Another subscription user cannot retrieve a record that does not belong to them
    Given I am logged in with the "products-retrieve-two@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/products/{{ products[1]._id }}" as "product"
    Then the status returned from the "product" request should be a 404 error
