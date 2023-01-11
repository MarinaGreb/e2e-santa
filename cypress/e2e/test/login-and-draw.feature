Feature: User login on santa website

    Scenario: Author logs in
        Given user is on secter santa website
        # When User logs in as "sokovets+test@outlook.com" and "123456"
        # When user logs in as "<login>" and "<password>"
        When user logs in with table
            | login                     | password |
            | sokovets+test@outlook.com | 123456   |

        Then user is on dashboard page
    # Examples:
    #     | login                      | password |
    #     | sokovets+test@outlook.com  | 123456   |
    #     | sokovets+test1@outlook.com | 123456   |
    #     | sokovets+test2@outlook.com | 123456   |
    #     | sokovets+test3@outlook.com | 123456   |
    Scenario: Author creates a box
        Given user is on secter santa website
        And user logs in with table
            | login                     | password |
            | sokovets+test@outlook.com | 123456   |
        And user is on dashboard page
        When user fills in the fields to create a box
        Then box has the correct name
        And top menu has the right items

    Scenario: Author adds members
        Given user copies invitation link
        Then user logs out

    # Scenario: User1 fills in the card
    #     Given user follows the link - invitation
    #     And user logs in with table
    #         | login                      | password |
    #         | sokovets+test1@outlook.com | 123456   |
    #     When  user creates a wishCrad
    #     Then user logs out

    # Scenario: User2 fills in the card
    #     Given user follows the link - invitation
    #     And user logs in with table
    #         | login                      | password |
    #         | sokovets+test2@outlook.com | 123456   |
    #     When  user creates a wishCrad
    #     Then user logs out

    # Scenario: User3 fills in the card
    #     Given user follows the link - invitation
    #     And user logs in with table
    #         | login                      | password |
    #         | sokovets+test3@outlook.com | 123456   |
    #     When  user creates a wishCrad
    #     Then user logs out

    Scenario: Users fill in a wish card
        Given user follows the link - invitation
        And user logs in as "<login>" and "<password>"
        When user creates a wishCrad
        Then block with a chat with santa appears
        Then user logs out
        Examples:
            | login                      | password |
            | sokovets+test1@outlook.com | 123456   |
            | sokovets+test2@outlook.com | 123456   |
            | sokovets+test3@outlook.com | 123456   |

    # Scenario: Author makes a quick draw
    #     Given user is on secter santa website
    #     And user logs in with table
    #         | login                     | password |
    #         | sokovets+test@outlook.com | 123456   |
    #     When user makes a quick draw
    #     Then notification of the end of the draw

    Scenario: Author makes a draw from the box
        Given user is on secter santa website
        And user logs in with table
            | login                     | password |
            | sokovets+test@outlook.com | 123456   |
        When user makes a draw from the box
        Then number of participants is 3
        Then user logs out

    Scenario:  Users checking notifications
        Given user is on secter santa website
        And user logs in as "<login>" and "<password>"
        When user check notifications
        Then need notification exists
        And user read all notification
        And user logs out

        Examples:
            | login                      | password |
            | sokovets+test1@outlook.com | 123456   |
            | sokovets+test2@outlook.com | 123456   |
            | sokovets+test3@outlook.com | 123456   |


    Scenario: Delete box with api reques
        Given user is on secter santa website
        And user logs in with table
            | login                     | password |
            | sokovets+test@outlook.com | 123456   |
        When api request to remove the box


