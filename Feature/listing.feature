Feature: Listing automation

#unhappy pass

    Scenario: Empty page
        Given I'm on the employee listing page
        Then I can see empty page without any records

    @create_records

    Scenario:fetching unknown data using filter
        Given I'm on the employee listing page
        When I filter the list by designation "Manager"
        Then I see the message stated as "Data not found"


    Scenario: searching the unknown name
        Given I'm on the employee listing page
        When I search the employee name by "aaaa"
        Then I see the message stated as "Data not found"


    #happy pass

    Scenario: Checking the headers of the table
        Given I'm on the employee listing page
        Then I see all the headers in the employee list 
    

    Scenario: fetching the known data using filter
        Given I'm on the employee listing page
        When I filter the employee list by designation as "SDET"

    
    Scenario: searching the list by name
        Given I'm on the employee listing page
        When I search the employee list by name
        Then I should see the searched name in the employee list 

/////////

    Scenario: sorting the list by name
        Given I'm on the employee table page
        When I sort the table by  name
        Then I see the list of employee data in ascending order
        //
        //



    Scenario: the pagination 
        Given I'm on the employee table page
        When I click on the next page

        Then I should see the next rows of table // psge no


        When I click on the previous page

        Then I see the previous rows of table


    Scenario: filter with pagination
        Given I'm on the employee table page
        When I filter the designation "SDET" in the present page

        Then I see the rows which has the Designation //

        When I go to the next page
        // page 2
        // sdet
        
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

