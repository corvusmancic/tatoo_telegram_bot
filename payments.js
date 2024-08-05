const { YooCheckout } = require("@a2seven/yoo-checkout");
const { v4: uuidv4 } = require('uuid');


const shopData = {    
 secret_key: 'live__IlRcmsx7T2_LG7oVeBR_aRfojLqjb3kajun1s89gBY',
 shop_id: 416583
}


const checkout = new YooCheckout({ shopId: shopData.shop_id, secretKey: shopData.secret_key });


async function createPay(price) {

    const createPayload = {
        amount: {
            value: price,
            currency: 'RUB'
        },
        confirmation: {
            type: 'redirect',
            return_url: 'https://web.telegram.org/a/#6892019573'
        },
        capture: true,
        description: 'Оплата товара с магазина Membrana.'
    };
    
    const idempotenceKey = uuidv4();
    try {
        const payment = await checkout.createPayment(createPayload, idempotenceKey);
        const infoPay = {
            payment:  payment.confirmation.confirmation_url,
            paymentId: payment.id,
            key: idempotenceKey,
        }
        return infoPay;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function getPay(paymentId) {
    try {
        const payment = await checkout.getPayment(paymentId);
        return payment;
    } catch (error) {
         console.error(error);
    }
}



async function confirmPay(paymentId) {
    try {
        const payment = await checkout.getPayment(paymentId);
        return payment;
    } catch (error) {
         console.error(error);
    }
}

async function cancelPay(paymentId, key) {
    try {
        const receipt = await checkout.cancelPayment(paymentId, key);
        return receipt;
    } catch (error) {
         console.error(error);
    }
}






module.exports = { createPay, getPay, cancelPay, confirmPay };