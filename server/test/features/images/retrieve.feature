@Images @ImagesRetrieve
Feature: Retrieval of images stored on S3

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName           | strapline                    |
      | Images Retrieve One | Automated subscription entry |
      | Images Retrieve Two | Automated subscription entry |
    And there are the following "images" records in the database
      | subscription               | name                   | usage | size |
      | {{ subscriptions[1]._id }} | ImagesRetrieve Image A | icon  | 128  |
      | {{ subscriptions[1]._id }} | ImagesRetrieve Image B | logo  | 256  |
    And there are the following "accounts" records in the database
      | identity                           | password | status | subscription               |
      | images-retrieve-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |
      | images-retrieve-two@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[2]._id }} |

  Scenario: Requesting an image that does not exist on S3
    Given I am logged in with the "images-retrieve-one@venzra-test.io" account
    And there is a HEAD consumer at "https://s3.eu-west-1.amazonaws.com/images.venzra-test.com" for "/{{ subscriptions[1]._id }}/icon/{{ images[1]._id }}" that will return status 404
    When I make a GET request to the API endpoint "/api/images/{{ images[1]._id }}" as "image" with "application/octet-steam" content type
    Then the status returned from the "image" request should be a 404 error

  Scenario: Requesting an image that is an icon of type PNG
    Given I am logged in with the "images-retrieve-one@venzra-test.io" account
    And there is a HEAD consumer at "https://s3.eu-west-1.amazonaws.com/images.venzra-test.com" for "/{{ subscriptions[1]._id }}/icon/{{ images[1]._id }}" that will return "images/meta-png.json" with status 200
    And there is a GET consumer at "https://s3.eu-west-1.amazonaws.com/images.venzra-test.com" for "/{{ subscriptions[1]._id }}/icon/{{ images[1]._id }}" that will return "images/400x100.png" with status 200
    When I make a GET request to the API endpoint "/api/images/{{ images[1]._id }}" as "image" with "application/octet-steam" content type
    Then there should be a 200 response from the "image" request with an "image/png" binary containing:
      | width | height | format |
      | 400   | 100    | png    |

  Scenario: Requesting an image that is a logo of type JPEG
    Given I am logged in with the "images-retrieve-one@venzra-test.io" account
    And there is a HEAD consumer at "https://s3.eu-west-1.amazonaws.com/images.venzra-test.com" for "/{{ subscriptions[1]._id }}/icon/{{ images[1]._id }}" that will return "images/meta-jpeg.json" with status 200
    And there is a GET consumer at "https://s3.eu-west-1.amazonaws.com/images.venzra-test.com" for "/{{ subscriptions[1]._id }}/icon/{{ images[1]._id }}" that will return "images/400x100.jpg" with status 200
    When I make a GET request to the API endpoint "/api/images/{{ images[1]._id }}" as "image" with "application/octet-steam" content type
    Then there should be a 200 response from the "image" request with an "image/jpeg" binary containing:
      | width | height | format |
      | 400   | 100    | jpeg   |

  Scenario: Requesting meta information about the image stored
    Given I am logged in with the "images-retrieve-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/images/{{ images[1]._id }}" as "image"
    Then there should be a 200 response from the "image" request that contains:
      | _id                 | name                   | usage | size |
      | {{ images[1]._id }} | ImagesRetrieve Image A | icon  | 128  |
