// 測驗服務
// 功能:
// 抓題目丟出去
// 計算分數
// 換算動物結果

import { Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';
import { Quiz } from './quiz.interface';
import { UserStage } from 'src/enum/enum';

@Injectable()
export class QuizService {
  quizzes: Quiz[] = [
    {
      image: 'https://i.imgur.com/xGKyc25.png',
      question: '1.森林遊玩, 遇到黑熊, 你手上有把小槍, 你可能會?',
      options: [
        '趕緊逃走',
        '停在原處,停止呼吸',
        '拿起槍, 直接射擊',
        '拿著槍防衛, 相信會沒事',
      ],
    },
    {
      image: 'https://i.imgur.com/8Ke5g0D.png',
      question: '2.當你被在乎的人反駁,第一時間你會 ?',
      options: [
        '算了,以後再說',
        '愣住,不知所措',
        '據以力爭,為自己說話',
        '明白對方,各有角度',
      ],
    },
    {
      image: 'https://i.imgur.com/miLobeX.png',
      question: '3.當你被好朋友誤會,第一時間你會 ?',
      options: [
        '情緒慌張,趕緊岔題',
        '情緒無助,不知所措',
        '情緒生氣,怎可誤解',
        '感受情緒,接納一切',
      ],
    },
    {
      image: 'https://i.imgur.com/zKpIlWn.png',
      question: '4.當你被權威者指責,第一時間你會?',
      options: [
        '想辦法離開現場',
        '停原地被罵,把感覺切掉',
        '直接回應回去',
        '感受內在情緒',
      ],
    },
    {
      image: 'https://i.imgur.com/OAdzsv0.png',
      question: '5. 當你被挑釁時, 第一時間你會?',
      options: [
        '想辦法搞笑,幽默帶過',
        '假裝沒聽懂,自動滑過',
        '怎能被挑釁,給他激回去',
        '看懂挑釁背後,對方需求',
      ],
    },
  ];

  main() {
    // this.sayHello();
  }

  // 進場詞
  getEntryMessage() {
    const msg = `情緒原型評測\n此評測請用直覺點選\n只需一分鐘即可完成\n開始測驗 !!!!`;
    const message: line.Message = {
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
    };
    return message;
  }

  getQuizMessageByStage(userStage: UserStage): Quiz {
    switch (userStage) {
      case UserStage.QUIZ1:
        // 回傳第一題
        return this.quizzes[0];
      case UserStage.QUIZ2:
        // 回傳第二題
        return this.quizzes[1];
      case UserStage.QUIZ3:
        // 回傳第三題
        return this.quizzes[2];
      case UserStage.QUIZ4:
        // 回傳第四題
        return this.quizzes[3];
      case UserStage.QUIZ5:
        // 回傳第五題
        return this.quizzes[4];
      default:
        return this.quizzes[0];
    }
  }

  // 產生選項 for line bot
  generateLineOptionsByArray(options: string[]): line.FlexComponent {
    const lineOptions: line.FlexComponent = {
      type: 'box',
      layout: 'vertical',
      contents: [],
    };
    options.forEach((option, index) => {
      const lineOption: line.FlexComponent = {
        type: 'button',
        action: {
          type: 'message',
          label: option,
          text: (index + 1).toString(),
        },
        style: 'link',
      };
      lineOptions.contents.push(lineOption);
    });
    return lineOptions;
  }

  // 題目
  getQuiz(userStage: UserStage): line.Message {
    // 選中的題目
    const quiz = this.getQuizMessageByStage(userStage);
    const lineOptions = this.generateLineOptionsByArray(quiz.options);
    const message: line.Message = {
      type: 'flex',
      altText: quiz.question,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: quiz.image,
              size: 'full',
            },
            {
              type: 'text',
              text: quiz.question,
              wrap: true,
            },
            lineOptions,
          ],
        },
      },
    };
    return message;
  }

  // 回傳結果訊息
  getResultMessage(result: string): line.Message {
    if (!result) return this.getEntryMessage();
    let resultUrl = '';
    switch (result) {
      case '1':
        // 忍者
        resultUrl = 'https://i.imgur.com/01NsPDl.png';
        break;
      case '2':
        // 雪寶
        resultUrl = 'https://i.imgur.com/lNJjDQW.png';
        break;
      case '3':
        // 悟空
        resultUrl = 'https://i.imgur.com/smp1y9Q.png';
        break;
      case '4':
        // 阿凡達
        resultUrl = 'https://i.imgur.com/ub6VTtO.png';
        break;
      default:
        resultUrl = 'https://i.imgur.com/ub6VTtO.png';
        break;
    }

    const message: line.Message = {
      type: 'flex',
      altText: result,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: resultUrl,
              size: 'full',
            },
            {
              type: 'text',
              text: result,
              wrap: true,
            },
          ],
        },
      },
    };
    return message;
  }
}
