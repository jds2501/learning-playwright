class DashboardPage {
    constructor(page) {
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink='/dashboard/cart']");
    }

    async addToCart(productName) {
        // Print titles on page
        const allTitles = await this.productsText.allTextContents();
        console.log(allTitles);

        // Find the product to buy
        const targetProductIndex = allTitles.indexOf(productName);

        // Buy the product
        if(targetProductIndex >= 0){
            await this.products.nth(targetProductIndex).locator("[style='float: right;']").click();
            return true;
        }

        return false;
    }

    async navigateToCart() {
        await this.cart.click();
    }
}

module.exports = {DashboardPage};