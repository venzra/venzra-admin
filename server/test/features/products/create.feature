@Products @ProductsCreate
Feature: Creation of a new product entry

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName           | status |
      | Products Create One | ACTIVE |
      | Products Create Two | ACTIVE |
    And there are the following "accounts" records in the database
      | identity                           | password | status | subscription               |
      | products-create-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |
      | products-create-two@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[2]._id }} |
    And there are the following "images" records in the database
      | subscription               | name                   | usage   | size |
      | {{ subscriptions[1]._id }} | ProductsCreate Image A | feature | 1024 |
      | {{ subscriptions[1]._id }} | ProductsCreate Image B | feature | 4096 |
      | {{ subscriptions[2]._id }} | ProductsCreate Image C | feature | 2048 |
    And there are the following "products" records in the database
      | subscription               | code       | displayName      | featureImage        | promotionalImage    | currentPrice | status |
      | {{ subscriptions[1]._id }} | CREATE-001 | Product Create A | {{ images[1]._id }} | {{ images[2]._id }} | 999          | ACTIVE |

  Scenario: An empty request to create a product fails validation
    Given I am logged in with the "products-create-one@venzra-test.io" account
    When I make an empty POST request to the API endpoint "/api/products" as "product"
    Then there should be a 400 error from the "product" request that contains:
      | message           | detail                                                                                          |
      | Validation failed | ["promotionalImage required", "displayName required", "code required", "currentPrice required"] |

  Scenario: If the product already exists then the request should be rejected (based on product code)
    Given I am logged in with the "products-create-one@venzra-test.io" account
    When I make a POST request to the API endpoint "/api/products" as "product" using:
      | code                   | displayName        | featureImage        | promotionalImage    | currentPrice |
      | {{ products[1].code }} | Product Create AAA | {{ images[1]._id }} | {{ images[2]._id }} | 99           |
    Then there should be a 400 response from the "product" request that contains:
      | message               |
      | Record already exists |

  Scenario: If the product already exists then the request should be rejected (based on product name)
    Given I am logged in with the "products-create-one@venzra-test.io" account
    When I make a POST request to the API endpoint "/api/products" as "product" using:
      | code       | displayName                   | featureImage        | promotionalImage    | currentPrice |
      | CREATE-999 | {{ products[1].displayName }} | {{ images[1]._id }} | {{ images[2]._id }} | 99           |
    Then there should be a 400 response from the "product" request that contains:
      | message               |
      | Record already exists |

  Scenario: A valid request to create a new product record is successful (also strips any decimal places on price)
    Given I am logged in with the "products-create-one@venzra-test.io" account
    When I make a POST request to the API endpoint "/api/products" as "product" using:
      | code       | displayName      | featureImage        | promotionalImage    | currentPrice |
      | CREATE-002 | Product Create B | {{ images[2]._id }} | {{ images[1]._id }} | 99.99        |
    Then there should be a 200 response from the "product" request that contains:
      | _id       | slug             | code       | history  | displayName      | featureImage        | promotionalImage    | previousPrice | currentPrice | status   | created   | updated   |
      | OBJECT_ID | product-create-b | CREATE-002 | ARRAY[0] | Product Create B | {{ images[2]._id }} | {{ images[1]._id }} | 0             | 99           | INACTIVE | DATE_TIME | DATE_TIME |

  Scenario: An account linked to another subscription can use the same product code and name already used by a different subscription
    Given I am logged in with the "products-create-two@venzra-test.io" account
    When I make a POST request to the API endpoint "/api/products" as "product" using:
      | code                   | displayName                   | featureImage        | promotionalImage    | previousPrice | currentPrice |
      | {{ products[1].code }} | {{ products[1].displayName }} | {{ images[3]._id }} | {{ images[3]._id }} | 104.99        | 99.49        |
    Then there should be a 200 response from the "product" request that contains:
      | _id       | slug             | code       | history  | displayName      | featureImage        | promotionalImage    | previousPrice | currentPrice | status   | created   | updated   |
      | OBJECT_ID | product-create-a | CREATE-001 | ARRAY[0] | Product Create A | {{ images[3]._id }} | {{ images[3]._id }} | 104           | 99           | INACTIVE | DATE_TIME | DATE_TIME |
