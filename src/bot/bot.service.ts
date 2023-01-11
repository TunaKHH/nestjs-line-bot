import { Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';
import { QuizService } from 'src/quiz/quiz.service';

@Injectable()
export class BotService {
  constructor(private quizService: QuizService) {}

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

  // 處理使用者訊息
  handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    const msg = this.quizService.getEntryMessage();

    return this.client.replyMessage(event.replyToken, {
      type: 'flex',
      altText: msg,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: 'https://i.imgur.com/awSXNi4.png',
              size: 'full',
            },
            {
              type: 'text',
              text: msg,
              wrap: true,
            },
            {
              type: 'button',
              action: {
                type: 'message',
                label: '開始測驗!!!',
                text: '開始測驗!!!',
              },
              style: 'link',
            },
          ],
        },
      },
    });
  }
}
