const startBut = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Заказать скорее', callback_data: '001' }],
            [{ text: 'Связаться с менеджером', callback_data: '002' }],
        ]
    })
}
const menegerContact = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Связаться с менеджером', callback_data: '002' }],
        ]
    })
}

const city = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Москва', callback_data: 'msk' }, { text: 'Петербург', callback_data: 'spb' }],
            [{ text: 'Доставкой по России', callback_data: 'castomSity' }]

        ]
    })
}

const order = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Доставкой по городу', callback_data: 'castomSity' }],
            [{ text: 'Самовывоз', callback_data: 'dontOrder' }]

        ]
    })
}


const valueCream = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '30ml (700р)', callback_data: '30ml' }, { text: '250ml (2000р)' , callback_data: '250ml' }],
            [{ text: '30 + 250 (2500р)', callback_data: '280ml' }],
            [{ text: 'Любое другое колличество', callback_data: 'optValue' }]

        ]
    })
}


const blancOrder = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Приступим к заполнению данных для доставки', callback_data: 'startBlanc' }],
        ]
    })
}

const confirmUserData = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Подтверждаю введеные данные.', callback_data: 'payment' }],
        ]
    })

}

const payment = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'ЮКасса', callback_data: 'yookassa' }],
        ]
    })

}

const yookasa = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Оплатить товар', callback_data: 'yookassa' }], //тут надо реализовать саму оплату при нажатии на кнопку
        ]
    })

}

const variantsAdress = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: 'msk1' }],
            [{ text: '2', callback_data: 'msk2' }],
            [{ text: '3', callback_data: 'msk3' }],
        ]
    })
}


module.exports = { startBut, city, order, valueCream, blancOrder, menegerContact, variantsAdress, confirmUserData, payment, yookasa }
