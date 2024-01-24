const base  = require('@playwright/test');

exports.customtest = base.test.extend(
    {
        testDataForOrder : {
            username : "descript.linking@gmail.com",
            password : "Lindy123$",
            productName : "ADIDAS ORIGINAL"
        }
    }
)