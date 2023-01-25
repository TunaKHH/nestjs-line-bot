import { Injectable } from '@nestjs/common';
import { QuizService } from 'src/quiz/quiz.service';
import * as line from '@line/bot-sdk';
import { UserService } from 'src/user/user.service';
import { UserStorageService } from 'src/session/userStorage.service';
import { UserStage } from 'src/enum/enum';

@Injectable()
export class BotService {
  constructor(
    private quizService: QuizService,
    private userService: UserService,
    private userStorage: UserStorageService,
  ) {}

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

  // 更新使用者email
  updateUserEmail(userId: string, email: string) {
    const user = this.userStorage.getUser(userId);
    user.email = email;
  }

  // 處理使用者訊息
  handleEvent(event: line.WebhookEvent): Promise<line.MessageAPIResponseBase> {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }

    // 取得使用者資料
    const user = this.userStorage.getUser(event.source.userId);

    // 處理使用者輸入的訊息
    try {
      this.userService.handleUserInput(user, event.message.text);
    } catch (e) {
      // 如果有錯誤就回傳錯誤訊息
      const message: line.Message = {
        type: 'text',
        text: e.message,
      };
      return this.client.replyMessage(event.replyToken, message);
    }

    // 處理要傳給使用者的訊息
    let responseMessage = null;

    switch (user.stage) {
      case UserStage.ENTRY: // 進場詞
        responseMessage = this.quizService.getEntryMessage();
        break;
      case UserStage.QUIZ1: // 題目
      case UserStage.QUIZ2:
      case UserStage.QUIZ3:
      case UserStage.QUIZ4:
      case UserStage.QUIZ5:
        responseMessage = this.quizService.getQuiz(user.stage);
        break;
      case UserStage.RESULT_TEST: // 測驗結果
        responseMessage = this.quizService.getResultMessage(
          this.userService.getMostAnswer(user),
        );

        break;
      case UserStage.RESULT_EMAIL: // 使用者輸入email結束
        // 取得詢問使用者name的訊息
        responseMessage = this.quizService.getResultNameMessage();
        break;
      case UserStage.RESULT_NAME: // 使用者輸入姓名結束
        // TODO 將使用者資料寫入google sheet
        // this.userService.writeUserToSheet(user);
        responseMessage = this.quizService.getResultShareMessage();
        break;
      case UserStage.RESULT_SHARE: // 分享結果
        // responseMessage = this.quizService.getResultShareMessage();
        break;
    }

    // 更新使用者的下一個stage狀態
    this.userStorage.updateUserNextStage(event.source.userId);
    // 回傳訊息
    return this.client.replyMessage(event.replyToken, responseMessage);
  }
}
