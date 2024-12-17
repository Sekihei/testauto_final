import { test } from './fixtures.ts';
import { request, APIRequestContext, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/loginpage'
import { StorePage } from '../pages/storepage'

let password: string
//Login with consumer (PASSWORD works with in pipeline only)
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
    await storepage.selectProductMenu();
    await storepage.selectProductById('1');
    await storepage.addToCart();
    await storepage.buyProduct();
    await storepage.fillCustomerDetails('Name', 'Testgatan 2');
    await storepage.confirmPurchase();
    await storepage.closePurchaseConfirmation();

    await expect(page.getByRole('listitem')).toContainText('1 x Apple - $15');
    await expect(page.locator('#name')).toContainText('Thank you for your purchase, Name');
    await expect(page.locator('#address')).toContainText('It will be shipped to: Testgatan 2');
    await expect(page.locator('#finalReceipt')).toContainText('Total: $15');
    await expect(page.locator('#finalReceipt')).toContainText('Grand Total: $17');
})

//Extra test
test('Extra test', async () =>{
    
})

//Use API: https://hoff.is/store2/api/v1/price/1
test('Get product info by ID', async ({ apiContext }) => {
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

//Accesibility: Will fail, has length 5
test.only('Accessibility check on Store page', async ({ page }) => {
    // Navigate to the page
    await page.goto('https://hoff.is/store2/?username=Markus&role=consumer');

    // Run Axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Log violations
    console.log('Accessibility Violations:', accessibilityScanResults.violations);

    // Check no violations exist
    expect(accessibilityScanResults.violations).toHaveLength(0);
});