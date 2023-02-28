import { Injectable } from '@nestjs/common';
import { UserStage } from 'src/enum/enum';

@Injectable()
export class StageService {
  constructor() {}

  // UserStage的順序
  nextStages = [
    UserStage.ENTRY,
    UserStage.QUIZ1,
    UserStage.QUIZ2,
    UserStage.QUIZ3,
    UserStage.QUIZ4,
    UserStage.QUIZ5,
    UserStage.RESULT_TEST,
    UserStage.RESULT_EMAIL,
    UserStage.RESULT_NAME,
    UserStage.RESULT_SIGNUP,
    UserStage.RESULT_PHONE,
    UserStage.RESULT_LINE_ID,
    // UserStage.RESULT_SHARE,
    UserStage.ENTRY,
  ];

  // 取得下一個UserStage
  getNextStage(stage: UserStage): UserStage {
    // 如果stage是最後一個就回傳第一個
    return (
      this.nextStages[this.nextStages.indexOf(stage) + 1] || UserStage.ENTRY
    );
  }
}
