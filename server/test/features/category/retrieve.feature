@Category @CategoryRetrieve
Feature: Retrieve information for a category

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName             | status |
      | Category Retrieve One | ACTIVE |
      | Category Retrieve Two | ACTIVE |
    And there are the following "accounts" records in the database
      | identity                             | password | status | subscription               |
      | category-retrieve-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |
      | category-retrieve-two@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[2]._id }} |
    And there are the following "images" records in the database
      | subscription               | name                     | usage   | size |
      | {{ subscriptions[1]._id }} | CategoryRetrieve Image A | feature | 1024 |
    And there are the following "categories" records in the database in series
      | subscription               | name                | description           | primary |
      | {{ subscriptions[1]._id }} | Category Retrieve A | Automated description | true    |
      | {{ subscriptions[1]._id }} | Category Retrieve B | Automated description | false   |
      | {{ subscriptions[1]._id }} | Category Retrieve C | Automated description | false   |
      | {{ subscriptions[2]._id }} | Category Retrieve A | Automated description | false   |
    And the following "categories" records are updated in the database
      | _id                     | parent                  | children                    |
      | {{ categories[2]._id }} | null                    | ["{{ categories[3]._id }}"] |
      | {{ categories[3]._id }} | {{ categories[2]._id }} | []                          |

  # TODO: Look into an update database option to assign children and parent information (then uncomment and fix the below steps)

  Scenario: Retrieval of a category contains correct data
    Given I am logged in with the "category-retrieve-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/categories/{{ categories[1]._id }}" as "category"
    Then there should be a 200 response from the "category" request that contains:
      | _id       | slug                | name                | description           | primary | children | created   | updated   |
      | OBJECT_ID | category-retrieve-a | Category Retrieve A | Automated description | true    | ARRAY[0] | DATE_TIME | DATE_TIME |

  Scenario: Retrieval of a category contains correct data
    Given I am logged in with the "category-retrieve-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/categories/{{ categories[2]._id }}" as "category"
    Then there should be a 200 response from the "category" request that contains:
      | _id       | slug                | name                | description           | primary | children | created   | updated   |
      | OBJECT_ID | category-retrieve-b | Category Retrieve B | Automated description | false   | ARRAY[1] | DATE_TIME | DATE_TIME |
    And the response path "children" from the "category" request contains:
      | _id       | slug                | name                | primary | created   | updated   |
      | OBJECT_ID | category-retrieve-c | Category Retrieve C | false   | DATE_TIME | DATE_TIME |

  Scenario: Retrieval of a category contains correct data
    Given I am logged in with the "category-retrieve-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/categories/{{ categories[3]._id }}" as "category"
    Then there should be a 200 response from the "category" request that contains:
      | _id       | slug                | name                | description           | primary | parent | children | created   | updated   |
      | OBJECT_ID | category-retrieve-c | Category Retrieve C | Automated description | false   | OBJECT | ARRAY[0] | DATE_TIME | DATE_TIME |
    And the response path "parent" from the "category" request contains:
      | _id       | slug                | name                | primary | created   | updated   |
      | OBJECT_ID | category-retrieve-b | Category Retrieve B | false   | DATE_TIME | DATE_TIME |

  Scenario: Another subscription user cannot retrieve a record that does not belong to them
    Given I am logged in with the "category-retrieve-two@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/categories/{{ categories[1]._id }}" as "category"
    Then the status returned from the "category" request should be a 404 error
