import {Given, When, Then} from "@cucumber/cucumber"
import {Builder,By,until} from "selenium-webdriver"
import { faker } from '@faker-js/faker';
import axios from 'axios';
import expect from 'chai';



let driver;
BeforeAll(async function(){

   const driver = await new Builder().forBrowser('chrome').build();

});

Before('@create_records', async function(){

    try {

        const response = await axios.get('https://api.example.com/initial-data');
        console.log('GET response data:', response.data);
        const data=[
                { ID: '201', Name: person1, Age: '25' , Designation: 'SDET',status:'IN'},
                { ID: '202', Name: person2, Age: '22' , Designation: 'SDET',status:'IN'},
                { ID: '203', Name: person3, Age: '22' , Designation: 'DevOps',status:'OUT'},
                { ID: '204', Name: person4, Age: '28' , Designation: 'Frontend',status:'IN'},
                { ID: '205', Name: person5, Age: '25' , Designation: 'Mobile',status:'IN'},
                { ID: '208', Name: person6, Age: '24' , Designation: 'Mobile',status:'OUT'},
                { ID: '207', Name: person7, Age: '23' , Designation: 'Mobile',status:'IN'}

          ];
        for (const payload of data) {
            const config = { 'content-type': 'application/json' };
            const postResponse = await axios.post('https://api.example.com/setup-data', payload,config);
            console.log('POST response data:', postResponse.data);
          }

          } catch (error) {
            console.error('Error in Before hook:', error);
          }

});

Given('I\'m on the employee table page', async function(){
    await driver.get('https://ninjatables.com/examples-of-data-table-design-on-website/');
    await new Promise(resolve => setTimeout(resolve,3000));
    driver.manage().window().maximize();

});

Then('I see empty page without any records', async function(){
    const rows = await driver.findElements(By.css('tbody'));
    const emptyrow=await rows.findElement(By.css('tr'));
    expect(emptyrow.length).to.equal(0);   

}); 

When('I filter the list by status {string}', async function(data){
    await driver.wait(until.elementLocated(By.css('[data-testid="dt-filter-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),data); 
    await new Promise(resolve => setTimeout(resolve,3000));

});

Then('I see the message stated as {string}',async function(message){
        let check = false;
        let counter = 100;
        while (counter > 0) {
            let pageSource = await driver.getPageSource();
            check = pageSource.includes(message);

            if (check) {
                console.log("checked");
                return "passed";

            } else {
                console.log("else block");
                await new Promise((resolve) => setTimeout(resolve, 300));
                counter--;
            }
        }
        throw new Error("Failed");
    });

When ('I search the table by fake name', async function(){
   const name=faker.person.firstName();
   await driver.wait(until.elementLocated(By.css('[data-testid="dt-search-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),name);
   await new Promise(resolve => setTimeout(resolve,3000));

});


When('I check the headers in the table', async function(){
    this.head=await driver.wait(until.elementLocated(By.xpath('//*[@id=table]/thead/tr[1]')));  

});

Then("I should see the headers name", async function(){
    const headerCells = await header_row.findElements(By.css('th')); 
    const headers = await Promise.all(headerCells.map(async cell => {
    const text = await cell.getText();
      return text.trim();

}));

const expectedHeaders = ['ID', 'Name', 'Age', 'Designation', 'Status']; 
expect(headers).to.deep.equal(expectedHeaders);

});

When('I filter the list by designation as {string}', async function(desig){
    this.role = await driver.wait(until.elementLocated(By.css('[data-testid="dt-filter-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),desig); 
    await new Promise(resolve => setTimeout(resolve,3000));
});


Then('I see the filtered list',async function(){
    let rows = await driver.wait(until.elementsLocated(By.xpath('//*[@id=table]/tbody/tr')));
    for (let row of rows) {
      let column_data = await row.findElement(By.xpath('//*[@id=table]/tbody/tr/td[4]'));
      let row_Text = await column_data.getText();
      expect(row_Text).to.equal(role);

    }

});

When('I search the table by name as {string}', async function(name){
   this.actual_search=await driver.wait(until.elementLocated(By.css('[data-testid="dt-search-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),name);
    await new Promise(resolve => setTimeout(resolve,3000));

});



Then('I see the row of the employee data', async function(){
    let name_element=await driver.wait(until.elementLocated(By.xpath('//*[@id=example]/tbody/tr/td[2]')))
    let name_text=await name_element.getText();
    expect(name_text).to.equal(actual_search);

});


When('I sort the table by name', async function(){
    await driver.wait(until.elementLocated(By.xpath('//*[@id=table]/thead/tr[1]/th[2]/span[@class="dt-column-title"][1]'))).click(); //same classname for all the headers so it is span[@cls=''][1] 

});

Then('I see the list of employee data in ascending order',async function(){
    const all_elements = await driver.findElements(By.css('.dt-column-title2'));
    const names=await Promise.all(all_elements.map(async element => await element.getText()));
    const sortednames = [...names].sort();
    expect(names).to.deep.equal(sortednames);
});

When('I click on the next page',async function(button){
    await driver.wait(until.elementLocated(By.css('[data-testid="next-page"]'))).click(button);

});

Then('I should see the next rows of table', async function(){

    await driver.wait(until.elementLocated(By.css('#table')), 5000);
    await new Promise(resolve => setTimeout(resolve,3000));

});

When('I click on the previous page', async function(button){

    await driver.wait(until.elementLocated(By.css('[data-testid="previous-page"]'))).click(button);

});

Then('I see the previous rows of table', async function(){

    await driver.wait(until.elementLocated(By.css('#table')), 5000);
    await new Promise(resolve => setTimeout(resolve,3000));

});


When('I filter the designation {string} in the present page', async function(role){

    this.data= await driver.wait(until.elementLocated(By.css('[data-testid="dt-filter-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),role); 

});


Then('I see the rows which has the Designation', async function(){
    let rows = await driver.findElements(By.xpath("//*[@id=table]/tbody/tr"));
    for (let row of rows) {
      let each_row = await row.findElement(By.xpath('./td[4]'));  
      let row_Text = await each_row.getText();
      expect(row_Text).to.equal(data);

    }

});


When('I go to the next page', async function(){
    await driver.wait(until.elementLocated(By.css('[data-testid="next-page"]'))).click(button);
    await driver.wait(until.elementLocated(By.css('#table')), 5000);
});


When('I go to the previous page', async function(){

    await driver.wait(until.elementLocated(By.css('[data-testid="previous-page"]'))).click(button);
    await driver.wait(until.elementLocated(By.css('#table')), 5000);

});



