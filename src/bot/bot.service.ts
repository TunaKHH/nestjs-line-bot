import { Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';

@Injectable()
export class BotService {
  config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
  };

  client = new line.Client(this.config);

  onModuleInit() {
    this.botMessage();
  }
  middleware() {
    return line.middleware(this.config);
  }

  botMessage() {
    process.env.NTBA_FIX_319 = '1';

    // Matches /done 紀錄該使用者完成運動到google sheet
    line.Client.bind('message', (event) => {
      console.log(event);
    });
  }

  handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }

    return this.client.replyMessage(event.replyToken, {
      type: 'text',
      text: event.message.text,
    });
  }
}
