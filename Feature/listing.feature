Feature: Listing automation

#unhappy pass

    Scenario: Empty page
        Given I'm on the employee table page
        Then I see empty page without any records

    @create_records

    Scenario Outline:fetching unknown data using filter
        Given I'm on the employee table page
        When I filter the list by status "<data>"
        Then I see the message stated as "Data not found"

        Examples: 
        |data         | 
        | CHECKED-IN  |
        | CHECKED-OUT |

    Scenario: searching the unknown name
        Given I'm on the employee table page
        When I search the table by fake name
        Then I see the message stated as "Data not found"


    #happy pass

    Scenario: Checking the headers of the table
        Given I'm on the employee table page
        When I check the headers in the table
        Then I should see the headers name


    Scenario Outline: fetching the known data using filter
        Given I'm on the employee table page
        When I filter the list by designation as "<desig>"
        Then I see the filtered list

        Examples:
        |desig  |
        |SDET   |
        |DevOps |


    Scenario: searching the list by name
        Given I'm on the employee table page
        When I search the table by name as "person1"
        Then I see the row of the employee data 


    Scenario: sorting the list by name
        Given I'm on the employee table page
        When I sort the table by name
        Then I see the list of employee data in ascending order


    Scenario: the pagination 
        Given I'm on the employee table page
        When I click on the next page
        Then I should see the next rows of table
        When I click on the previous page
        Then I see the previous rows of table


    Scenario: filter with pagination
        Given I'm on the employee table page
        When I filter the designation "SDET" in the present page
        Then I see the rows which has the Designation
        When I go to the next page
        Then I see the rows which has the Designation
        When I go to the previous page
        Then I see the rows which has the Designation
    

    Scenario: sorting with pagination 
        Given I'm on the employee table page
        When I sort the table by name
        Then I see the list of employee data in ascending order 
        When I go to the next page
        Then I see the list of employee data in ascending order
        When I go to the previous page 
        Then I see the list of employee data in ascending order

