@Account @AccountRetrieve
Feature: Retrieve currently logged in account information

  @Seed
  Scenario: Setup test data seed for feature
    Given there are the following "subscriptions" records in the database
      | storeName            | status |
      | Account Retrieve One | TRIAL  |
    And there are the following "accounts" records in the database
      | identity                            | password | status | subscription               |
      | account-retrieve-one@venzra-test.io | PASSWORD | ACTIVE | {{ subscriptions[1]._id }} |

  Scenario: When there is no logged in user there should be no response
    When I make a GET request to the API endpoint "/api/v1/account" as "account"
    Then the status of the "account" request should be a 401 error

  Scenario: Retrieve account profile information
    Given I am logged in with the "account-retrieve-one@venzra-test.io" account
    When I make a GET request to the API endpoint "/api/v1/account" as "account"
    Then the 200 response from the "account" request contains:
      | _id       | identity                            | subscription | status |
      | OBJECT_ID | account-retrieve-one@venzra-test.io | OBJECT_ID    | ACTIVE |
