import { test } from './fixtures.ts';
import { request, APIRequestContext, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage'
import { StorePage } from '../pages/storepage'

let password: string

//Login with consumer
test('Login with consumer role', async ({page}) =>{
    const loginpage = new LoginPage(page)
    const storepage = new StorePage(page)
    if (process.env.PASSWORD !== undefined) {
        password = process.env.PASSWORD
    }

    console.log(password)
    await page.goto('https://hoff.is/login/')
    await loginpage.login('Markus', password, 'consumer')

    const header = await storepage.header.textContent()
    expect(header).toBe("Store")
})

//Buy something
test('Buy an apple', async ({page}) =>{
    const storepage = new StorePage(page)
    await storepage.navigateToStore('Markus', 'consumer');
    await storepage.selectProductMenu('1');
    await storepage.addToCart();
    await storepage.buyProduct();
    await storepage.fillCustomerDetails('Name', 'Testgatan 2');
    await storepage.confirmPurchase();
    await storepage.closePurchaseConfirmation();
})

//Extra test
test('Extra test', async () =>{
    
})

//Use API: https://hoff.is/store2/api/v1/price/1
test.only('Get product info by ID', async ({ apiContext }) => {
    const productId = 1; // Replace with any ID (1-10)
    
    // Make the API call
    const response = await apiContext.get(`price/${productId}`);
    
    // Verify response status
    expect(response.status()).toBe(200);

    // Parse and log the response
    const responseBody = await response.json();
    console.log(`Product Info for ID ${productId}:`, responseBody);

    // Assertions
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('name');
    expect(responseBody).toHaveProperty('price');
    expect(responseBody).toHaveProperty('vat')
    expect(responseBody.name).toBe('Apple')
    //{"id": 1, "name": "Apple", "price": 15, "vat": 3}
});

//Accesibility
test('Accesibility', async () =>{
    
})