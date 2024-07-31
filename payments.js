const { YooCheckout } = require("@a2seven/yoo-checkout");
const { v4: uuidv4 } = require('uuid');


const shopData = {    
 secret_key: 'live__IlRcmsx7T2_LG7oVeBR_aRfojLqjb3kajun1s89gBY',
 shop_id: 416583
}


const checkout = new YooCheckout({ shopId: shopData.shop_id, secretKey: shopData.secret_key });

const createPayload = {
    amount: {
        value: '1.00',
        currency: 'RUB'
    },
    payment_method_data: {
        type: 'bank_card'
    },
    confirmation: {
        type: 'redirect',
        return_url: 'test'
    }
};

async function createPay() {
    const idempotenceKey = uuidv4();
    try {
        const payment = await checkout.createPayment(createPayload, idempotenceKey);
        return payment.confirmation.confirmation_url;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



module.exports = { createPay };
