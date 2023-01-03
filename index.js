const telegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./utils/options');

const token = '5148023836:AAGysvi2DYosK9_L5emws_UAF3CP0_JvLwg';

const bot = new telegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "I'll think of a number from 0 to 9 and you will try to guess it"
  );

  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, 'Guess', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Start bot' },
    { command: '/info', description: 'Get info about user' },
    { command: '/game', description: 'Guess the number game' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/192/2.webp'
      );
      return bot.sendMessage(chatId, `Hello!`);
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "I don't understand you. Try again");
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (+data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Congratulations! You guessed the number ${chats[chatId]} 🎉`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `I\'m sorry, you don\'t guessed the number, I thought the number ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
