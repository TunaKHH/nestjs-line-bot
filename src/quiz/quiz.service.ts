// 測驗服務
// 功能:
// 抓題目丟出去
// 計算分數
// 換算動物結果

import { Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';
import { Quiz } from './quiz.interface';
import { Animal, ResultObject, UserStage } from 'src/enum/enum';

interface LineFlexMessage {
  url: string; // 圖片網址
  text: string; // 題目
  options: line.FlexComponent; // 選項
}
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
    // 結果文字

    const resultText = `上面圖片 是你的初步解答\n寫下您的姓名+mail送出\n可獲得更完整的詳細資料\n讓你更了解你自己\n也歡迎讓家中孩子一起評測`;
    // const resultText = `講座：【如何正向引導孩子的情緒】\n\n講座時間：02/10(星期五) 晚上7:30-9:00\n主辦單位：芙愛占心學院\n課程費用：免費\n上課方式：線上ZOOM直播\n(請先行下載ZOOM APP)\n\n填寫LINE ID以及 手機號碼\n我們將以line或簡訊\n通知提醒線上ZOOM直播教室連結哦~`;

    // 根據結果數字轉換成結果圖片
    const resultUrl = this.convertResultTextToImageUrl(result);

    const lineOptions = this.generateLineOptionsByArray([
      '直接在下方輸入email後送出',
    ]);
    const lineFlexMessage: LineFlexMessage = {
      url: resultUrl,
      text: resultText,
      options: lineOptions,
    };
    return this.generateFlexMessage(lineFlexMessage);
  }

  // 生成 flex message
  generateFlexMessage(lineFlexMessage: LineFlexMessage): line.Message {
    const message: line.Message = {
      type: 'flex',
      altText: lineFlexMessage.text,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              // 題目圖片
              type: 'image',
              url: lineFlexMessage.url,
              size: 'full',
            },
            {
              // 題目描述文字
              type: 'text',
              text: lineFlexMessage.text,
              wrap: true,
            },
            // 選項按鈕
            lineFlexMessage.options,
          ],
        },
      },
    };
    return message;
  }

  // 根據結果數字轉換成結果圖片
  convertResultTextToImageUrl(result: string): string {
    const imageUrls = {
      '1': 'https://i.imgur.com/01NsPDl.png', // 忍者
      '2': 'https://i.imgur.com/lNJjDQW.png', // 雪寶
      '3': 'https://i.imgur.com/smp1y9Q.png', // 悟空
      '4': 'https://i.imgur.com/ub6VTtO.png', // 阿凡達
      default: 'https://i.imgur.com/ub6VTtO.png', // 阿凡達
    };
    return imageUrls[result] || imageUrls.default;
  }

  // 取得結果分享訊息
  getResultShareMessage(animalName: string): line.Message {
    // 描述文字
    const descriptionText = `公益講座<如何正向引導孩子的情緒>\n講座時間 :先下載Zoom App 2/10(五)晚上7:30-9:00\n主辦單位 : 芙愛占心學院\n課程費用 : 父母免費研習\n上課方式 : 線上zoom直播互動\n(請先下載Zoom App)\n\n填寫Line ID 及 手機號碼\n我們將以Line 或 簡訊\n通知線上zoom直播教室連結喔`;
    // 要回傳的結果訊息
    const message: line.Message = {
      type: 'flex',
      altText: descriptionText,
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
              text: descriptionText,
              wrap: true,
            },
            {
              type: 'button',
              style: 'secondary',
              margin: 'md',
              color: '#FFCFAD',
              action: {
                type: 'message',
                label: ResultObject.ANSWER_SIGNUP.value.text,
                text: ResultObject.ANSWER_SIGNUP.value.text,
              },
            },
            {
              type: 'button',
              style: 'primary',
              margin: 'md',
              action: {
                type: 'uri',
                label: ResultObject.LINE_SHARE.value.text,
                uri: ResultObject.LINE_SHARE.value.url,
              },
            },
            {
              type: 'button',
              style: 'primary',
              color: '#2374e1',
              margin: 'md',
              action: {
                type: 'uri',
                label: ResultObject.FACEBOOK_SHARE.value.text,
                uri: ResultObject.FACEBOOK_SHARE.value.urls[animalName],
              },
            },
          ],
        },
      },
    };
    return message;
  }

  // 取得已經報名完成的結果分享訊息
  getSuccessSignupResultShareMessage(): line.Message {
    // 描述文字
    const descriptionText = `感謝您，報名已成功\n\n公益講座<如何正向引導孩子的情緒>\n講座時間 :先下載Zoom App 2/10(五)晚上7:30-9:00\n主辦單位 : 芙愛占心學院\n課程費用 : 父母免費研習\n上課方式 : 線上zoom直播互動\n(請先下載Zoom App)\n\n填寫Line ID 及 手機號碼\n我們將以Line 或 簡訊\n通知線上zoom直播教室連結喔`;
    // 要回傳的結果訊息
    const message: line.Message = {
      type: 'flex',
      altText: descriptionText,
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
              text: descriptionText,
              wrap: true,
            },
            {
              type: 'button',
              style: 'primary',
              margin: 'md',
              action: {
                type: 'uri',
                label: ResultObject.LINE_SHARE.value.text,
                uri: ResultObject.LINE_SHARE.value.url,
              },
            },
            {
              type: 'button',
              style: 'primary',
              color: '#2374e1',
              margin: 'md',
              action: {
                type: 'uri',
                label: ResultObject.FACEBOOK_SHARE.value.text,
                uri: ResultObject.FACEBOOK_SHARE.value.urls['水母'],
              },
            },
          ],
        },
      },
    };
    return message;
  }

  // 取得要求玩家輸入姓名的訊息
  getResultNameMessage(): line.Message {
    const message: line.Message = {
      type: 'text',
      text: `請輸入您的大名`,
    };
    return message;
  }

  // 取得要求玩家輸入電話的訊息
  getRequestUserPhoneMessage(): line.Message {
    const message: line.Message = {
      type: 'text',
      text: `請輸入您的手機號碼`,
    };
    return message;
  }

  // 取得要求玩家輸入Line ID的訊息
  getRequestUserLineIdMessage(): line.Message {
    const message: line.Message = {
      type: 'text',
      text: `請輸入您的Line ID`,
    };
    return message;
  }
  getResultAnimal(number: string): string {
    if (number === '1') {
      return Animal.NINJA.toString();
    }
    if (number === '2') {
      return Animal.SNOWMAN.toString();
    }
    if (number === '3') {
      return Animal.MONKEY.toString();
    }
    if (number === '4') {
      return Animal.AVATAR.toString();
    }
  }
}
