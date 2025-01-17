const { Bot } = require('grammy');
const bot = new Bot('7554852913:AAEkOoPyCc0xwym0Cg2UgtKwShKYcqCUtcU');
bot.command('start', (ctx) => {
    ctx.reply('Прив! Я бот. Напиши /help, чтобы узнать, что я умею!');
});

bot.command('help', (ctx) => {
    ctx.reply('/start - приветствие\n/help - помощь\n/echo - повторить сообщение\n/joke - рассказать шутку');
});

bot.command('echo', (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ');
    ctx.reply(message || 'введи сообщение для повторения');
});

bot.command('joke', async (ctx) => {
    const jokes = [
        '- Я замерз \n- Виталя, сядь ты в машину уже \n- Да как я в нее сяду, она ж на аварийке стоит',
        'скучен день до вечера коли парить нечего',
        'если бы программисты были врачами, им бы говорили «у меня болит нога», а они отвечали «ну не знаю, у меня такая же нога, а ничего не болит».',
        'чем отличается мегаящик от окна?\n\nиз мегаящика не выпадает сын мияги',
        'по машинам',
        'хз я на диване лежу',
        'тормози давай',
    ];

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await ctx.reply(randomJoke);
});
bot.start();
console.log('Бот запущен.......')