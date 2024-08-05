const { startBut, city, order, valueCream, variantsAdress, confirmUserData, payment, createButtonPay } = require('./buttons.js');
const { createPay, cancelPay, confirmPay } = require('./payments.js');
const TelegramApi = require('node-telegram-bot-api');

// const token = '7320665761:AAE_RpX9AjA1Kh147O4qu0RiQ2gMonu7U8U';
const token = '6937786912:AAG5kxs3uO1MnOSS-5cBjrQh7nTf1qOozrM';
// const token = '6892019573:AAG0TuLjDjYrm4_nvoj1lEjk3Q13fFlV0i8';

const chatIdAdmin = '-1002121086761';
// const chatIdAdmin = '-1002117052881';

const bot = new TelegramApi(token, { polling: true });

const textMessege = 'Теперь давай заполним твои данные для доставки в формате:\n \n Фамилия Имя Отчество \n Адрес \n Номер телефона \n \n Данные нужно отправлять одним сообщением. Писать нужно полностью не сокращая ! '
    
// let currentPay = undefined;
// let currentPayId = undefined;
// let lastPayId = {id: undefined, key: undefined}
// let currentAdress = undefined;
// let currentPrice = undefined;

const users = {

}



const prices = {
    '1ml': '1RUB',  
    '30ml': '700RUB',
    '250ml': '2000RUB',
    '280ml': '2500RUB'
}

const paymentMessage = async (chatId) => {
    const payment = await createPay(users[chatId].currentPrice)
    users[chatId].currentPayId = payment.paymentId;

    const message = await bot.sendMessage(chatId, 
        `Оплатите товар нажатием на кнопку 'Оплатить'. \n На произведение платежа выделено 10 минут, после чего платеж закроется. \n Если не успеете оплатить - повторите операцию. \n \n Сумма к оплате: ${users[chatId].currentPrice} рублей`,
        createButtonPay(payment.payment) 
    );
    if (users[chatId].currentPay) {
        await cancelPay(users[chatId].lastPayId.id, users[chatId].lastPayId.key).then(() => {
            //console.log(lastPayId)
            users[chatId].lastPayId.id = undefined;
            users[chatId].lastPayId.key = undefined;
        })
        await bot.deleteMessage(chatId, users[chatId].currentPay); // не засоряем оплату
    }
    
    users[chatId].currentPay = message.message_id;
    if (users[chatId].lastPayId.id === undefined) {
        users[chatId].lastPayId.id = payment.paymentId;
        users[chatId].lastPayId.key = payment.key;
        //console.log(lastPayId);
    }
}

const checkPayment = async (chatId, chatIdAdmin, message) => {
    const info = (await confirmPay(users[chatId].lastPayId.id))
    if (info.status === 'pending') {
        await bot.sendMessage(chatId, 'Оплата еще не прошла. Если вы оплатили попробуйте нажать кнопку чуть позже.')
    } else if (info.status === 'succeeded') {
        await bot.sendMessage(chatId, 'Оплата прошла успешно, в ближайшее время с вами свяжется менеджер.')
        
        await bot.sendMessage(chatIdAdmin, message)
        await bot.deleteMessage(chatId, users[chatId].currentPay)
        
    }
    console.log(info.status)
}


const start = () => {
    let mskAdress
    let localSity
    let localValue
    let inputDataOrder


    
    const undefinedFunction = () => {
        mskAdress = undefined
        localSity = undefined
        localValue = undefined
        inputDataOrder = undefined
    }

    bot.setMyCommands([
        { command: '/start', description: 'Окэээй-летсгоу!' },
        { command: '/help', description: 'Связаться с менеджером' },
    ]);

    bot.on('message', async (msg) => {
        const { text, chat, from } = msg;
        const chatId = chat.id;

        if(!users[chatId]) {
            users[chatId] = {
                currentPay: undefined,
                currentPayId: undefined,
                lastPayId: {id: undefined, key: undefined},
                currentAdress: undefined,
                currentPrice: undefined,
                currentCity: null,
                currentCount: null
            }
        }
    
        
        const handleAdminNotification = (message) => bot.sendMessage(chatIdAdmin, message)
    
        if (text === '/start') {
            return await bot.sendMessage(
                chatId,
                'Добро пожаловать в бота команды MEMBRANA, в данном боте вы можете c лёгкостью заказать многофункциональный крем)',
                startBut
            );
        }
    
        if (text === '/help') {
            await bot.sendMessage(
                chatId,
                'Мы в ближайшее время с вами свяжемся, оставайтесь на связи :)'
            );
            return await handleAdminNotification(`Прилетела заявочка от \n@${from.username}`);
        }
    
        if (text.length > 23) {
            const inputDataOrder = text;
            users[chatId].currentAdress = inputDataOrder;
            return await bot.sendMessage(
                chatId,
                `Внимательно проверьте ваши данные по заказу: Город: ${users[chatId].currentCity? users[chatId].currentCity : 'доставка по России'} 
                \n Стоимость: ${users[chatId].currentPrice? users[chatId].currentPrice : 'Данные не указаны повторите заново'} \n Количество: ${users[chatId].currentCount? users[chatId].currentCount: 'Данные не указаны повторите заново'} \n \n ${inputDataOrder}`, 
                confirmUserData);
            //return await handleAdminNotification(`Прилетела заявочка от \n@${from.username} \n ${inputDataOrder} \n Колличество: ${localValue}\n ${localSity ? 'Город: ' + localSity : ''}`);
        }
    
        return await bot.sendMessage(
            chatId,
            'Твой запрос мне не понятен, попробуй ещё раз!',
            startBut
        );
    });
    
    bot.on('callback_query', async (msg) => {
        const { data, message, from } = msg;
        const chatId = message.chat.id;
        
        const handleAdminNotification = (message) => {
            return bot.sendMessage(chatIdAdmin, message);
        };
    
        const handleOrder = async (quantity) => {
            const setPrice = () => {
                users[chatId].currentPrice = prices[quantity].replace('RUB', '.00');
                users[chatId].currentCount = quantity;
            }

            setPrice();
            
            localValue = quantity;
            if (mskAdress) {
                await handleAdminNotification(`Прилетела заявочка на самовывоз от \n@${from.username} \n Колличество: ${localValue}\n ${mskAdress}`);
                undefinedFunction(); 
                return await bot.sendMessage(chatId, 'Мы в ближайшее время с вами свяжемся, для подтверждения заказа, оставайтесь на связи ;)');
            }
            return await bot.sendMessage(chatId, textMessege);
        };
    
        switch (data) {
            case '001':
                return await bot.sendMessage(chatId, 'Выбери свой город', city);
            case '002':
                await bot.sendMessage(chatId, 'Мы в ближайшее время с вами свяжемся, оставайтесь на связи :)');
                return await handleAdminNotification(`Просит связаться с менеджером \n@${from.username}`);
            case 'msk':
                localSity = 'Москва';
                users[chatId].currentCity = 'Москва';
                return await bot.sendMessage(chatId, 'Теперь давай определимся как тебе удобнее забрать товар', order);
            case 'spb':
                localSity = 'Санкт-Петербург';
                users[chatId].currentCity = 'Санкт-Петербург';
                return await bot.sendMessage(chatId, 'Теперь давай определимся с количеством', valueCream);
            case 'voronej': 
                localSity = 'Воронеж';
                users[chatId].currentCity = 'Воронеж';
                return await bot.sendMessage(chatId, 'Теперь давай определимся как тебе удобнее забрать товар', order);
            case 'dontOrder':
                if(users[chatId].currentCity === 'Москва') {
                    return await bot.sendMessage(
                        chatId,
                        'Забрать наш чудо-крем в Москве можно по адресам: \n 1. Москва, Измайловское шоссе, 73ж \n 2. Ленинградский проспект 36 строение 38 \n 3. Марии Ульяновой 16 \n \n Выбери вариант где тебе удобнее забрать',
                        variantsAdress.Moscow
                    );
                } else {
                    return await bot.sendMessage(
                        chatId,
                        'Забрать наш чудо-крем в Воронеже можно по адресу: \n Воронеж, Ленина 43',
                        variantsAdress.Voronej
                    )
                }
                
            case 'castomSity':
            case 'localShopMoscow':
            case 'startBlanc':
                return await bot.sendMessage(chatId, 'Теперь давай определимся с количеством', valueCream);
            case 'optValue':
                localValue = 'Другое количество';
                if (mskAdress) {
                    await handleAdminNotification(`Прилетела заявочка на самовывоз от \n@${from.username} \n Колличество: ${localValue}\n ${mskAdress}`);
                    undefinedFunction();
                    return await bot.sendMessage(chatId, 'Мы в ближайшее время с вами свяжемся, для подтверждения заказа, оставайтесь на связи ;)');
                }
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай заполним твои данные для доставки в формате:\n \n Фамилия Имя Отчество \n Город Адрес \n Номер телефона \n \n Данные нужно отправлять одним сообщением. Писать нужно полностью не сокращая !'
                );
            case '280ml':
            case '250ml':
            case '30ml':
            case '1ml':
                return await handleOrder(data);
            case 'voronejCity': 
                mskAdress = 'Воронеж, Ленина 43';
                return await bot.sendMessage(chatId, 'Теперь давай определимся с количеством', valueCream);
            case 'voronej': 
                mskAdress = 'Воронеж, Ленина 43'
                return await bot.sendMessage(chatId, 'Теперь давай определимся с количеством', valueCream);
            case 'msk1':
                mskAdress = 'Измайловское шоссе, 73ж';
                return await bot.sendMessage(chatId, 'Теперь давай определимся с количеством', valueCream);
            case 'msk2':
                mskAdress = 'Ленинградский проспект 36 строение 38';
                return await bot.sendMessage(chatId, 'Теперь давай определимся с количеством', valueCream);
            case 'msk3':
                mskAdress = 'Марии Ульяновой 16';
                return await bot.sendMessage(chatId, 'Теперь давай определимся с количеством', valueCream);
            case 'payment':
                return await bot.sendMessage(chatId, 'Перейти к оплате:', payment);
            
            //тут идут способы оплаты
            case 'yookassa':
                if (!users[chatId].currentPrice) {
                    return await bot.sendMessage(chatId, 'Если вы готовы приступить к оплате нажмите оплатить', valueCream)
                }
                return await paymentMessage(chatId).then(() => users[chatId].currentPrice = undefined)
                //Вы выбрали способ оплаты ЮКасса, оплатите товар нажатием на кнопку 'Оплатить'. На произведение платежа выделено 10 минут, после чего платеж закроется. Если не успеете оплатить - повторите операцию. 
            case 'checkPay':
                const message = `Прилетела заявочка на доставку от \n@${from.username} \n ${users[chatId].currentAdress} \n Колличество: ${localValue}\n ${users[chatId].currentCity ? 'Город: ' + users[chatId].currentCity : 'Доставка по России' } \n \n Товар был оплачен онлайн.`
                return await checkPayment(chatId, chatIdAdmin, message)
        }
    });
    
    
};

start();
