const { YooCheckout } = require("@a2seven/yoo-checkout");


const shopData = {    
 secret_key: 'live__IlRcmsx7T2_LG7oVeBR_aRfojLqjb3kajun1s89gBY',
 shop_id: 416583
}


const checkout = new YooCheckout({ shopId: shopData.shop_id, secretKey: shopData.secret_key });

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';


const createPayment = (price = 0, myurl = '', paymentMsg = '') => {
    // Создаем синхронный payload
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
        },
        description: 'тестируем фичу'
    };

    const getUrl = async () => {
        const payment = await checkout.createPayment(createPayload, idempotenceKey);
        const url = payment.confirmation.confirmation_url;

        return url;
    }

    getUrl();

    

    
    
};

module.exports = { createPayment };
