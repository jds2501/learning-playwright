const { DashboardPage } = require('./DashboardPage');

class LoginPage {
    constructor (page) {
        this.page = page;
        this.signInButton = page.locator("#login");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo () {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async validLogin (username, password) {
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.page.locator(".card-body").last().waitFor();
        return new DashboardPage(this.page);
    }
}

module.exports = {LoginPage};