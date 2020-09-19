import TelegramBot from 'node-telegram-bot-api';
import config from '../../config.json';

// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.token, { polling: true });
export default function sendMessage(chatid:string, payload:any) {
  bot.sendMessage(chatid, payload);
}
