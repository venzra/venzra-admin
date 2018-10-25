@Locations @LocationsRetrieve
Feature: Retrieve information for a locations

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName              | status |
      | Locations Retrieve One | ACTIVE |
      | Locations Retrieve Two | ACTIVE |
    And there are the following "accounts" records in the database
      | identity                              | password | status | subscription               |
      | locations-retrieve-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |
      | locations-retrieve-two@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[2]._id }} |
    And there are the following "images" records in the database
      | subscription               | name                      | usage   | size |
      | {{ subscriptions[1]._id }} | LocationsRetrieve Image A | feature | 1024 |
    And there are the following "locations" records in the database
      | displayName          | description        | address                                                                                                                | featureImage        | usage    | subscription               |
      | Locations Retrieve A | Automated location | { "addressee": "Location manager", "street": "Street", "county": "County", "postalCode": "po57 3ox", "country": "GB" } | {{ images[1]._id }} | BUSINESS | {{ subscriptions[1]._id }} |
      | Locations Retrieve B | Automated location | { "addressee": "Location manager", "street": "Street", "county": "County", "postalCode": "po57 3ox", "country": "GB" } | {{ images[1]._id }} | STORE    | {{ subscriptions[1]._id }} |
      | Locations Retrieve A | Automated location | { "addressee": "Location manager", "street": "Street", "county": "County", "postalCode": "po57 3ox", "country": "GB" } | {{ images[1]._id }} | BUSINESS | {{ subscriptions[2]._id }} |

  Scenario: Retrieval of a location contains correct data
    Given I am logged in with the "locations-retrieve-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/locations/{{ locations[1]._id }}" as "location"
    Then there should be a 200 response from the "location" request that contains:
      | _id       | displayName          | description        | address | featureImage                | usage    | created   | updated   |
      | OBJECT_ID | Locations Retrieve A | Automated location | OBJECT  | OBJECT[_id,name,usage,path] | BUSINESS | DATE_TIME | DATE_TIME |
    And the response path "featureImage" from the "location" request contains:
      | _id                 | name                      | usage   | path                                                       |
      | {{ images[1]._id }} | LocationsRetrieve Image A | feature | {{ subscriptions[1]._id }}/feature/{{ images[1]._id }}.jpg |
    And the response path "address" from the "location" request contains:
      | _id       | addressee        | street | county | postalCode | country |
      | OBJECT_ID | Location manager | Street | County | PO573OX    | GB      |

  Scenario: Another subscription user cannot retrieve a record that does not belong to them
    Given I am logged in with the "locations-retrieve-two@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/locations/{{ locations[1]._id }}" as "location"
    Then the status returned from the "location" request should be a 404 error
