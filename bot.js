const { Bot, InlineKeyboard } = require('grammy');
const bot = new Bot('7554852913:AAEkOoPyCc0xwym0Cg2UgtKwShKYcqCUtcU');

const gameStates = {};

// команды и оформление текста
bot.command('start', (ctx) => {
    ctx.reply('привет. напиши /help чтобы узнать что я умею');
});

bot.command('help', (ctx) => {
    ctx.reply('/start - <b>приветствие</b>\n/help - <b>помощь</b>\n/echo - <b>повторить сообщение</b>\n/joke - <b>рассказать шутку</b>\n/games - <b>игры</b>', { parse_mode: 'HTML' });
});

bot.command('echo', (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ');
    ctx.reply(message || 'введи сообщение для повторения');
});

bot.command('joke', async (ctx) => {
    const jokes = [
        'если бы программисты были врачами, им бы говорили «у меня болит нога», а они отвечали «ну не знаю, у меня такая же нога, а ничего не болит».',
        'чем отличается мегаящик от окна?\n\nиз мегаящика не выпадает сын мияги',
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await ctx.reply(randomJoke);
});

bot.command('games', (ctx) => {
    const keyboard = new InlineKeyboard()
        .text('Орел Решка', 'orelreshka')
        .text('Камень, ножницы, бумага', 'knb')
        .text('Угадай число', 'number')
        .row()
        .text('Помощь', 'help');

    ctx.reply('Выберите игру:', { reply_markup: keyboard });
});

// обработка нажатий кнопок
bot.on('callback_query:data', async (ctx) => {
    const data = ctx.callbackQuery.data;
    const userId = ctx.from.id;

    if (data === 'orelreshka') {
        // орел решка
        gameStates[userId] = { game: 'orelreshka', step: 'bet' };
        const betKeyboard = new InlineKeyboard()
            .text('Орел', 'orel')
            .text('Решка', 'reshka');

        await ctx.answerCallbackQuery('Вы выбрали игру Орел или решка');
        await ctx.reply('Сделайте вашу ставку:', { reply_markup: betKeyboard });

    } else if (data === 'orel' || data === 'reshka') {
        // обработка ставки орел решка
        if (gameStates[userId] && gameStates[userId].game === 'orelreshka' && gameStates[userId].step === 'bet') {
            gameStates[userId].userBet = data;
            gameStates[userId].step = 'result';
            await processOrelReshkaResult(ctx);
        }
     } else if (data === 'knb') {
        //  камень ножницы бумага
        gameStates[userId] = { game: 'knb', step: 'bet' };
        const knbKeyboard = new InlineKeyboard()
            .text('Камень', 'kamen')
            .text('Ножницы', 'nozh')
            .text('Бумага', 'bumaga');
        
        await ctx.answerCallbackQuery('Вы выбрали игру Камень, ножницы, бугага');
        await ctx.reply('Сделайте ваш выбор:', { reply_markup: knbKeyboard });

    } else if (data === 'kamen' || data === 'nozh' || data === 'bumaga') {
         // обработка ставки камень ножницы бумага
        if(gameStates[userId] && gameStates[userId].game === 'knb' && gameStates[userId].step === 'bet'){
            gameStates[userId].userBet = data;
            gameStates[userId].step = 'result';
            await processKnbResult(ctx);
        }
    } else if  (data === 'number'){
        await ctx.reply('Вы проиграли');
     } else if (data === 'again') {
        // играть еще
        if (gameStates[userId] && gameStates[userId].game === 'orelreshka') {
            gameStates[userId] = { game: 'orelreshka', step: 'bet' };
             const betKeyboard = new InlineKeyboard()
                .text('Орел', 'orel')
                .text('Решка', 'reshka');
            await ctx.answerCallbackQuery('Начинаем новую игру!');
            await ctx.reply('Сделайте вашу ставку:', { reply_markup: betKeyboard });
        } else if (gameStates[userId] && gameStates[userId].game === 'knb') {
            gameStates[userId] = { game: 'knb', step: 'bet' };
             const knbKeyboard = new InlineKeyboard()
                .text('Камень', 'kamen')
                .text('Ножницы', 'nozh')
                .text('Бумага', 'bumaga');
            await ctx.answerCallbackQuery('Начинаем новую игру!');
            await ctx.reply('Сделайте ваш выбор:', { reply_markup: knbKeyboard });
        }

    } else if (data === 'noagain') {
        // закончить игру
        delete gameStates[userId];
        await ctx.answerCallbackQuery('Спасибо за игру!');
        await ctx.reply('До встречи!\n\n/start - приветствие\n/help - помощь\n/echo - повторить сообщение\n/joke - рассказать шутку\n/games - игры');
    }  else if (data === 'number') {
        ctx.answerCallbackQuery('Вы выбрали игру Угадай число');
        ctx.reply('');
    } else if (data === 'help') {
        ctx.answerCallbackQuery('Выберите кнопку для получения информации');
        ctx.reply('Нажмите кнопку, чтобы играть');
    }
});

// функция Орел Решка
async function processOrelReshkaResult(ctx) {
    const userId = ctx.from.id;
    const botResult = Math.random() < 0.5 ? 'orel' : 'reshka'; // "orel" или "reshka"
    const userBet = gameStates[userId].userBet;

    const displayUserBet = userBet === 'orel' ? 'Орел' : 'Решка';
    const displayBotResult = botResult === 'orel' ? 'Орел' : 'Решка';

    let message = `Вы выбрали: ${displayUserBet}\nБот выбрал: ${displayBotResult}\n\n`;

    if (userBet === botResult) {
        message += 'Вы выиграли!';
    } else {
        message += 'Вы проиграли!';
    }

    message += '\nХотите сыграть заново?';

    const playAgainKeyboard = new InlineKeyboard()
        .text('Да', 'again')
        .text('Нет', 'noagain');

    await ctx.reply(message, { reply_markup: playAgainKeyboard });
}

// функция Камень ножницы бумага
async function processKnbResult(ctx) {
    const userId = ctx.from.id;
    const botChoice = ['kamen', 'nozh', 'bumaga'][Math.floor(Math.random() * 3)];
    const userChoice = gameStates[userId].userBet;

      const displayUserChoice = userChoice === 'kamen' ? 'Камень' : userChoice === 'nozh' ? 'Ножницы' : 'Бумага';
      const displayBotChoice = botChoice === 'kamen' ? 'Камень' : botChoice === 'nozh' ? 'Ножницы' : 'Бумага';

    let message = `Вы выбрали: ${displayUserChoice}\nБот выбрал: ${displayBotChoice}\n\n`;

    if (userChoice === botChoice) {
      message += 'Ничья!';
    } else if (
      (userChoice === 'kamen' && botChoice === 'nozh') ||
      (userChoice === 'nozh' && botChoice === 'bumaga') ||
      (userChoice === 'bumaga' && botChoice === 'kamen')
    ) {
      message += 'Вы выиграли!';
    } else {
      message += 'Вы проиграли!';
    }

     message += '\nХотите сыграть заново?';

    const playAgainKeyboard = new InlineKeyboard()
    .text('Да', 'again')
    .text('Нет', 'noagain');

    await ctx.reply(message, {reply_markup: playAgainKeyboard});
}

bot.start();
console.log('Бот запущен.......');