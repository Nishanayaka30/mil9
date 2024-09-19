Feature: Listing automation

#unhappy pass

    Scenario: Empty page
        Given I'm on the employee listing page
        Then I should see empty page without any records

    @create_records

    Scenario:fetching unknown data using filter
        Given I'm on the employee listing page
        When I filter the list by designation "Manager"
        Then I should see the message stated as "Data not found"


    Scenario: searching the unknown name
        Given I'm on the employee listing page
        When I search the employee name by "aaaa"
        Then I should see the message stated as "Data not found"


    #happy pass

    Scenario: Checking the headers of the table
        Given I'm on the employee listing page
        Then I should see all the headers in the employee list 
    

    Scenario: fetching the known data using filter
        Given I'm on the employee listing page
        When I filter the employee list by designation as "SDET"
        Then I should see the list of SDET employees

    
    Scenario: searching the list by name
        Given I'm on the employee listing page
        When I search the employee list by name
        Then I should see the searched name in the employee list 


    Scenario: sorting the list by name
        Given I'm on the employee listing page
        When I click on sort button based on employee name
        Then I should see the list of employee names in ascending order
        When I click on sort button based on employee name
        Then I should see the list of employee names in descending order


    Scenario: filter with pagination
        Given I'm on the employee listing page
        When I filter the employee list by designation as "SDET"
     
        When I click on the next page
        Then I should see the filtered list of employees 
    
        When I click on the previous page
        Then I should see the filtered list of employees 
    

    Scenario: sorting with pagination 
        Given I'm on the employee listing page
        When I click on sort button based on employee name
        Then I should see the list of employee names in ascending order
        When I navigate to the next page
        Then I should see the list of employee names in ascending order
        When I go to the previous page 
        Then I should see the list of employee names in ascending order

