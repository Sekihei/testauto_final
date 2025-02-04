import { test } from './fixtures.ts';
import { request, APIRequestContext, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/loginpage'
import { StorePage } from '../pages/storepage'

let password: string
const testData = {
    username: 'Markus',
    role: 'consumer',
    name: 'Markus Hoff',
    address: 'Testgatan1'
}

//Login with consumer (PASSWORD works with in pipeline only)
test('Login with consumer role', async ({page}) =>{
    const loginpage = new LoginPage(page)
    const storepage = new StorePage(page)
    if (process.env.PASSWORD !== undefined) {
        password = process.env.PASSWORD
    }

    console.log(password)
    await page.goto('https://hoff.is/login/')
    await loginpage.login(testData.username, password, testData.role)

    const header = await storepage.header.textContent()
    expect(header).toBe("Store"), 'Expect to have been relocated to store after login'
})

//Buy something
test('Buy an apple', async ({page}) =>{
    const storepage = new StorePage(page)
    await storepage.navigateToStore(testData.username, testData.role)
    await storepage.selectProductMenu()
    await storepage.selectProductById('1')
    await storepage.addToCart()
    await storepage.buyProduct()
    await storepage.fillCustomerDetails(testData.name, testData.address)
    await storepage.confirmPurchase()
    await storepage.closePurchaseConfirmation()

    await expect(page.getByRole('listitem')).toContainText('1 x Apple - $15')
    await expect(page.locator('#name')).toContainText(`Thank you for your purchase, ${testData.name}`)
    await expect(page.locator('#address')).toContainText(`It will be shipped to: ${testData.address}`)
    await expect(page.locator('#finalReceipt')).toContainText('Total: $15')
    await expect(page.locator('#finalReceipt')).toContainText('Grand Total: $17')
})

//Additional test
test('Add and remove one product from cart', async ({page}) =>{
    const storepage = new StorePage(page)
    await storepage.navigateToStore(testData.username, testData.role)
    await storepage.selectProductMenu()
    await storepage.selectProductById('1')
    await storepage.addToCart()
    await storepage.selectProductMenu()
    await storepage.selectProductById('2')
    await storepage.addToCart()

    await expect(storepage.appleInCart).toHaveCount(1), 'Expecting apple to exist in cart'
    await expect(storepage.bananaInCart).toHaveCount(1), 'Expecting banana to exist in cart'

    await storepage.removeBanana()

    await expect(storepage.appleInCart).toHaveCount(1), 'Expecting apple to still exist in cart'
    await expect(storepage.bananaInCart).toHaveCount(0), 'Expecting banana to have been removed from cart'
})

//Use API: https://hoff.is/store2/api/v1/price/1
test('Get product info by ID', async ({ apiContext }) =>{
    const productId = 1; // Replace with any ID (1-10)
    
    // Make the API call
    const response = await apiContext.get(`price/${productId}`)
    
    // Verify response status
    expect(response.status()).toBe(200);

    // Parse and log the response
    const responseBody = await response.json();
    console.log(`Product Info for ID ${productId}:`, responseBody)

    // Assertions
    expect(responseBody).toEqual({
        id: productId,
        name: 'Apple',
        price: 15,
        vat: 3
    }), 'Expecting product to have correct values'

})

//Accesibility: Will fail, has length 1, not 0
test('Accessibility check on product dropdown', async ({ page }) =>{
    const storepage = new StorePage(page)
    await storepage.navigateToStore(testData.username, testData.role)

    const violations = await storepage.performAccessibilityCheck('[data-testid="select-product"]')

    console.log('Dropdown Violations:', violations);
    expect(violations).toHaveLength(0), 'Expecting no violations'
})