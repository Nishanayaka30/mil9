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

Given('I\'m on the employee listing page', async function(){
    await driver.get('https://ninjatables.com/examples-of-data-table-design-on-website/');
    await new Promise(resolve => setTimeout(resolve,3000));
    driver.manage().window().maximize();

});

Then('I see empty page without any records', async function(){
    const rows = await driver.findElements(By.css('tbody'));
    const emptyrow=await rows.findElement(By.css('tr'));
    expect(emptyrow.length).to.equal(0);   

}); 

When('I filter the list by designation {string}', async function(data){
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

When ('I search the employee name by {string}', async function(name){

   await driver.wait(until.elementLocated(By.css('[data-testid="dt-search-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),name);
   const firstrowcell = await driver.wait(until.elementLocated(By.xpath('//*[@id=table]/tbody/tr[1]/td[2]')));  
   const cellTexts = await Promise.all(firstrowcell.map(cell => cell.getText()));
   const namefound = cellTexts.some(text => text.includes(name));

   expect(namefound).to.be.false;
   await new Promise(resolve => setTimeout(resolve,3000));

});


When('I see all the headers in the employee list', async function(){
    const expectedHeaders = ['ID', 'Name', 'Age', 'Designation', 'Status']; 
    this.header_row=await driver.wait(until.elementLocated(By.xpath('//*[@id=table]/thead/tr[1]')));  
    const headerCells = await header_row.findElements(By.css('th')); 
    const headerTexts = await Promise.all(headerCells.map(cell => cell.getText()));

    for (const expectedHeader of expectedHeaders) {
        expect(headerTexts).to.deep.equal(expectedHeader);
    }

});

When('I filter the employee list by designation as {string}', async function(desig){
    const role = await driver.wait(until.elementLocated(By.css('[data-testid="dt-filter-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),desig); 
    await new Promise(resolve => setTimeout(resolve,3000));
    let rows = await driver.wait(until.elementsLocated(By.xpath('//*[@id=table]/tbody/tr')));
    for (let row of rows) {
      let column_data = await row.findElement(By.xpath('//*[@id=table]/tbody/tr/td[4]'));
      let row_Text = await column_data.getText();
      expect(row_Text).to.equal(role);
    }
});



When('I search the employee list by name', async function(){
   this.name=person1;
   this.actual_search=await driver.wait(until.elementLocated(By.css('[data-testid="dt-search-0"]'))).sendKeys(Key.chord(CONTROL,'a',Key.DELETE),name);
    await new Promise(resolve => setTimeout(resolve,3000));
});

Then('I should see the searched name in the employee list',async function(){ 
    const firstrowcell = await driver.wait(until.elementLocated(By.xpath('//*[@id=table]/tbody/tr[1]/td[2]')));  
   const cellTexts = await Promise.all(firstrowcell.map(cell => cell.getText()));
   const namefound = cellTexts.some(text => text.includes(this.name));

   expect(namefound).to.be.true;
   await new Promise(resolve => setTimeout(resolve,3000));

});


When('I click on sort button based on employee name', async function(){
    await driver.wait(until.elementLocated(By.xpath('//*[@id=table]/thead/tr[1]/th[2]/span[@class="dt-column-title"][1]'))).click(); //same classname for all the headers so it is span[@cls=''][1] 
    await new Promise(resolve => setTimeout(resolve,3000));
});

Then('I see the list of employee data in ascending order',async function(){
    const all_elements = await driver.findElements(By.css('.dt-column-title2'));
    const names=await Promise.all(all_elements.map(async element => await element.getText()));
    const sortednames = [...names].sort();
    expect(names).to.deep.equal(sortednames);
});

Then('I see the list of employee data in decending order',async function(){
    const all_elements = await driver.findElements(By.css('.dt-column-title2'));
    const names=await Promise.all(all_elements.map(async element => await element.getText()));
    const sortednames = [...names].sort().reverse();
    expect(names).to.deep.equal(sortednames);
});

When('I navigate to the next page',async function(button){
    await driver.wait(until.elementLocated(By.css('[data-testid="next-page"]'))).click(button);
    await new Promise(resolve => setTimeout(resolve,3000));
});

Then('I should see the next page number highlighted and filtered list of employees', async function(){
    let page_number = 2;
    const nextpagebutton = await driver.findElement(By.xpath(`//button[@class='page-number' and text()='${page_number}']`));
    const pagecolor = await nextpagebutton.getCssValue('background-color');
    const bluecolor= 'rgba(0, 0, 255, 1)';
    expect(pagecolor).to.equal(bluecolor);

    await driver.wait(until.elementLocated(By.css('#table')), 5000);
    await new Promise(resolve => setTimeout(resolve,3000));

});

When('I click on the previous page', async function(button){

    await driver.wait(until.elementLocated(By.css('[data-testid="previous-page"]'))).click(button);
    await new Promise(resolve => setTimeout(resolve,3000));
});

Then('I should see the previous page number highlighted and filtered list of employees ', async function(){
    let page_number = 1;
    const nextpagebutton = await driver.findElement(By.xpath(`//button[@class='page-number' and text()='${page_number}']`));
    const pagecolor = await nextpagebutton.getCssValue('background-color');
    const bluecolor= 'rgba(0, 0, 255, 1)';
    expect(pagecolor).to.equal(bluecolor);

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



AfterAll(async function(){

    await driver.quit();
 
 });



