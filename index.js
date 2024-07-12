const { startBut, city, order, valueCream, blancOrder, menegerContact, variantsAdress } = require('./buttons.js');


const TelegramApi = require('node-telegram-bot-api');

// const token = '7320665761:AAE_RpX9AjA1Kh147O4qu0RiQ2gMonu7U8U';
const token = '6937786912:AAG5kxs3uO1MnOSS-5cBjrQh7nTf1qOozrM';

const chatIdAdmin = '-1002121086761';

const bot = new TelegramApi(token, { polling: true });

const textMessege = 'Теперь давай заполним твои данные для доставки в формате:\n \n Фамилия Имя Отчество \n Адрес \n Номер телефона \n \n Данные нужно отправлять одним сообщением. Писать нужно полностью не сокращая ! '


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
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return await bot.sendMessage(
                chatId,
                'Добро пожаловать в бота команды Membrana, в данном боте вы можете c лёгкостью заказать увлажняющий крем для ваших тату)',
                startBut
            );
        } else if (text === '/help') {
            bot.sendMessage(
                chatId,
                'Мы в ближайшее время с вами свяжемся, оставайтесь на связи :) '

            );
            return await bot.sendMessage(
                chatIdAdmin,
                `Прилетела заявочка от \n@${msg.from.username}`
            )
        } else if (text.length > 23) {
            inputDataOrder = text
            bot.sendMessage(
                chatId,
                'Мы в ближайшее время с вами свяжемся, для подтверждения заказа, оставайтесь на связи ;) '

            );
            return await bot.sendMessage(
                chatIdAdmin,
                `Прилетела заявочка от \n@${msg.from.username} \n ${inputDataOrder} \n Колличество: ${localValue}\n ${localSity ? 'Город: ' + localSity : ''}`
            )
        } else {
            return await bot.sendMessage(
                chatId,
                'Твой запрос мне не понятен, попробуй ещё раз!',
                startBut
            );
        }
    });
    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        switch (data) {
            case '001':
                return await bot.sendMessage(chatId, 'Выбери свой город', city);
            case '002':
                bot.sendMessage(
                    chatId,
                    'Мы в ближайшее время с вами свяжемся, оставайтесь на связи :) '

                );
                return await bot.sendMessage(
                    chatIdAdmin,
                    `Просит связаться с менеджером \n@${msg.from.username}`
                );
            case 'msk':
                localSity = 'Москва'
                return await bot.sendMessage(chatId,
                    'Теперь давай определимся как тебе удобнее забрать товар ',
                    order);
            case 'spb':
                localSity = 'Санкт-Петербург'
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай определимся с колличеством ',
                    valueCream);
            case 'dontOrder':
                // bot.sendMessage(
                //     chatIdAdmin,
                //     `@${msg.from.username} просмотрел адреса для самовывоза в мск. Лучше написать вручную.`

                // );
                return await bot.sendMessage(
                    chatId,
                    'Забрать наш чудо-крем в Москве можно по адресам: \n 1. Москва, Измайловское шоссе, 73ж \n 2. Ленинградский проспект 36 строение 38 \n 3. Марии Ульяновой 16 \n \n Выбери вариант где тебе удобнее забрать' ,
                    variantsAdress);
            case 'castomSity':
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай определимся с колличеством',
                    valueCream);
            case 'localShopMoscow':
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай определимся с колличеством',
                    valueCream);
            case 'optValue':
                localValue = 'Другое колличество'
                if(mskAdress){
                    bot.sendMessage(
                        chatIdAdmin,
                        `Прилетела заявочка на самовывоз от \n@${msg.from.username} \n Колличество: ${localValue}\n ${mskAdress}`
                    )
                    undefinedFunction()
                    return await bot.sendMessage(
                        chatId,
                        'Мы в ближайшее время с вами свяжемся, для подтверждения заказа, оставайтесь на связи ;)');
                }
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай заполним твои данные для доставки в формате:\n \n Фамилия Имя Отчество \n Город Адрес \n Номер телефона \n \n Данные нужно отправлять одним сообщением. Писать нужно полностью не сокращая ! ');
            case '280ml':
                localValue = '280ml'
                if(mskAdress){
                    bot.sendMessage(
                        chatIdAdmin,
                        `Прилетела заявочка на самовывоз от \n@${msg.from.username} \n  Колличество: ${localValue}\n ${mskAdress}`
                    )
                    undefinedFunction()
                    return await bot.sendMessage(
                        chatId,
                        'Мы в ближайшее время с вами свяжемся, для подтверждения заказа, оставайтесь на связи ;)');
                }
                return await bot.sendMessage(
                    chatId,
                    textMessege);
            case '250ml':
                localValue = '250ml'
                if(mskAdress){
                    bot.sendMessage(
                        chatIdAdmin,
                        `Прилетела заявочка на самовывоз от \n@${msg.from.username} \n  Колличество: ${localValue}\n ${mskAdress}`
                    )
                    undefinedFunction()
                    return await bot.sendMessage(
                        chatId,
                        'Мы в ближайшее время с вами свяжемся, для подтверждения заказа, оставайтесь на связи ;)');
                }
                return await bot.sendMessage(
                    chatId,
                    textMessege);
            case '30ml':
                localValue = '30ml'
                if(mskAdress){
                    bot.sendMessage(
                        chatIdAdmin,
                        `Прилетела заявочка на самовывоз от \n@${msg.from.username} \n Колличество: ${localValue}\n ${mskAdress}`
                    )
                    undefinedFunction()
                    return await bot.sendMessage(
                        chatId,
                        'Мы в ближайшее время с вами свяжемся, для подтверждения заказа, оставайтесь на связи ;)');
                }
                return await bot.sendMessage(
                    chatId,
                    textMessege);
            case 'msk1':
                mskAdress = 'Измайловское шоссе, 73ж'
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай определимся с колличеством',
                    valueCream);
            case 'msk2':
                mskAdress = ' Ленинградский проспект 36 строение 38'
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай определимся с колличеством',
                    valueCream);
            case 'msk3':
                mskAdress = 'Марии Ульяновой 16'
                return await bot.sendMessage(
                    chatId,
                    'Теперь давай определимся с колличеством',
                    valueCream);
            case 'startBlanc':

                return await bot.sendMessage(
                    chatId,
                    'Теперь давай определимся с колличеством',
                    valueCream);
        }
    });
};

start();