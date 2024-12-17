import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly chooseUser: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByLabel("Username");
        this.passwordInput = page.getByLabel("Password");
        this.chooseUser = page.getByLabel("Select Role");
        this.submitButton = page.getByRole('button', {name: "Login"});
        this.errorMessage = page.getByTestId('error-message');
    }

    async login(username: string, password: string, usertype: string) {
       await this.usernameInput.fill(username);
       await this.passwordInput.fill(password);
       await this.chooseUser.selectOption(usertype)
       await this.submitButton.click();
    }
}