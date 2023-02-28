import { Injectable } from '@nestjs/common';
import { QuizService } from 'src/quiz/quiz.service';
import * as line from '@line/bot-sdk';
import { UserService } from 'src/user/user.service';
import { UserStorageService } from 'src/session/userStorage.service';
import { ResultObject, UserStage } from 'src/enum/enum';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class BotService {
  constructor(
    private quizService: QuizService,
    private userService: UserService,
    private userStorage: UserStorageService,
    private firebaseService: FirebaseService,
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
        // 取得測驗結果的訊息(1~4)
        const resultNum = this.userService.getMostAnswer(user);

        // 取得使用者測驗的結果動物 並儲存到user
        user.animal = QuizService.getResultAnimal(resultNum).toString();

        responseMessage = this.quizService.getResultMessage(resultNum);
        break;
      case UserStage.RESULT_EMAIL: // 使用者輸入email結束
        // 取得詢問使用者name的訊息
        responseMessage = this.quizService.getResultNameMessage();
        break;
      case UserStage.RESULT_NAME: // 使用者輸入姓名結束
        // 取得包含報名的訊息的結果訊息
        responseMessage = this.quizService.getResultShareMessage(user.animal);
        break;
      case UserStage.RESULT_SIGNUP: // 使用者點擊報名後
        // 如果使用者輸入的不是報名
        if (ResultObject.ANSWER_SIGNUP.value.text !== event.message.text) {
          // 再次詢問使用者是否要報名
          responseMessage = this.quizService.getResultShareMessage(user.animal);
          return this.client.replyMessage(event.replyToken, responseMessage);
        }
        // 詢問使用者聯絡電話
        responseMessage = this.quizService.getRequestUserPhoneMessage();
        break;

      case UserStage.RESULT_PHONE: // 使用者輸入電話結束
        // 詢問使用者line id
        responseMessage = this.quizService.getRequestUserLineIdMessage();
        break;
      case UserStage.RESULT_LINE_ID: // 使用者輸入line id結束
        // 取得分享的訊息
        responseMessage = this.quizService.getSuccessSignupResultShareMessage(
          user.animal,
        );
        break;
      case UserStage.RESULT_SHARE: // 分享結果被點擊
        // responseMessage = this.quizService.getResultShareMessage(user.animal);
        break;
    }

    // 更新使用者的下一個stage狀態
    this.userStorage.updateUserNextStage(event.source.userId);
    // 回傳訊息
    return this.client.replyMessage(event.replyToken, responseMessage);
  }
}
