import BscscanConroller from './controllers/bscscan';
import TelegramController from './controllers/telegram';
import DatabasesController from './controllers/database';
import config from '../config.json';

  const token: string = config.telegram_token;
  const chats: number[] = config.chats;
  const interval: number = config.interval;

    if (token != undefined || null){
        console.info("설정파일 로드에 성공했습니다 :)")
    }

  TelegramController.initTelegram(token, chats);

