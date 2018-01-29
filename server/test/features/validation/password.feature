@Validation @ValidationPassword
Feature: Validation of a password format

  Scenario: An empty request to validate a password returns a message
    When I make an empty POST request to the API endpoint "/api/validation/password" as "validation"
    Then there should be a 200 response from the "validation" request that contains:
      | score | message                               |
      | 0     | Use a few words, avoid common phrases |

  Scenario: A commonly used password fails validation
    When I make a POST request to the API endpoint "/api/validation/password" as "validation" using:
      | password |
      | password |
    Then there should be a 200 response from the "validation" request that contains:
      | score | message                          |
      | 0     | This is a top-10 common password |

  Scenario: A less common weak password receives a low score
    When I make a POST request to the API endpoint "/api/validation/password" as "validation" using:
      | password      |
      | MyPassword123 |
    Then there should be a 200 response from the "validation" request that contains:
      | score | message                                     |
      | 1     | This is similar to a commonly used password |

  Scenario: A more complex password with low entropy will score slightly better
    When I make a POST request to the API endpoint "/api/validation/password" as "validation" using:
      | password |
      | Venzra$1 |
    Then there should be a 200 response from the "validation" request that contains:
      | score | message                                             |
      | 2     | Add another word or two. Uncommon words are better. |

  Scenario: A longer word using 2 works achieves a higher levels of entropy
    When I make a POST request to the API endpoint "/api/validation/password" as "validation" using:
      | password   |
      | VenzraTest |
    Then there should be a 200 response from the "validation" request that contains:
      | score |
      | 3     |

  Scenario: A password using a mix of characters and numbers is valid and scores well
    When I make a POST request to the API endpoint "/api/validation/password" as "validation" using:
      | password     |
      | VenzraTest$1 |
    Then there should be a 200 response from the "validation" request that contains:
      | score |
      | 4     |
