import { Locator, Page } from "@playwright/test";

export class StorePage {
    readonly page: Page;
    readonly usernameText: Locator;
    readonly header: Locator;
    readonly selectProduct: Locator;
    readonly addToCartButton: Locator;
    readonly buyButton: Locator;
    readonly nameInput: Locator;
    readonly addressInput: Locator;
    readonly confirmPurchaseButton: Locator;
    readonly closeButton: Locator;
    readonly removeBananaButton: Locator;
    readonly appleInCart: Locator; 
    readonly bananaInCart: Locator; 
    readonly appleQuantity: Locator;
    readonly bananaQuantity: Locator;
    //

    constructor(page: Page) {
        this.page = page;
        this.usernameText = page.getByTestId("username");
        this.header = page.locator('h1');
        this.selectProduct = page.getByTestId('select-product');
        this.addToCartButton = page.getByTestId('add-to-cart-button');
        this.buyButton = page.getByRole('button', { name: 'Buy' });
        this.nameInput = page.getByLabel('Name:');
        this.addressInput = page.getByLabel('Address:');
        this.confirmPurchaseButton = page.getByRole('button', { name: 'Confirm Purchase' });
        this.closeButton = page.getByText('Close');
        this.removeBananaButton = page.getByTestId('Banana-remove-button')
        this.appleInCart = page.getByTestId('Apple-receipt-name')
        this.bananaInCart = page.getByTestId('Banana-receipt-name')
        this.appleQuantity = page.getByTestId('Apple-receipt-quantity')
        this.bananaQuantity = page.getByTestId('Banana-receipt-quantity')
    }

    async navigateToStore(username: string, role: string): Promise<void> {
        const url = `https://hoff.is/store2/?username=${username}&role=${role}`;
        await this.page.goto(url);
    }

    async selectProductMenu(): Promise<void> {
        await this.selectProduct.click();
    }

    async selectProductById(productId: string): Promise<void> {
        await this.selectProduct.selectOption(productId);
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    async buyProduct(): Promise<void> {
        await this.buyButton.click();
    }

    async fillCustomerDetails(name: string, address: string): Promise<void> {
        await this.nameInput.fill(name);
        await this.addressInput.fill(address);
    }

    async confirmPurchase(): Promise<void> {
        await this.confirmPurchaseButton.click();
    }

    async closePurchaseConfirmation(): Promise<void> {
        await this.closeButton.click();
    }

    async removeBanana(): Promise<void> {
        await this.removeBananaButton.click();
    }
}