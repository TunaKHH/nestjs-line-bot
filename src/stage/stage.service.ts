import { Injectable } from '@nestjs/common';
import { UserStage } from 'src/enum/enum';

@Injectable()
export class StageService {
  constructor() {}

  // 取得下一個UserStage
  getNextStage(stage: UserStage): UserStage {
    switch (stage) {
      case UserStage.NONE:
        return UserStage.ENTRY;
      case UserStage.ENTRY:
        return UserStage.QUIZ1;
      case UserStage.QUIZ1:
        return UserStage.QUIZ2;
      case UserStage.QUIZ2:
        return UserStage.QUIZ3;
      case UserStage.QUIZ3:
        return UserStage.QUIZ4;
      case UserStage.QUIZ4:
        return UserStage.QUIZ5;
      case UserStage.QUIZ5:
        return UserStage.RESULT;
      case UserStage.RESULT:
        return UserStage.ENTRY;
      default:
        return UserStage.ENTRY;
    }
  }
}
