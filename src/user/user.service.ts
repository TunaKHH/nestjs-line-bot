// 測驗服務
// 功能:
// 抓題目丟出去
// 計算分數
// 換算動物結果

import { Injectable } from '@nestjs/common';
import * as line from '@line/bot-sdk';
import { User } from './user.interface';
import { UserStage } from 'src/enum/enum';

@Injectable()
export class UserService {
  // 更新使用者session的stage狀態
  updateUserStage(userId: string, message: string): void {
    return;
  }

  handleUserInput(user: User, message: string): void {
    // 如果user.stage是QUIZ類型就把答案存起來
    if (
      user.stage === UserStage.QUIZ1 ||
      user.stage === UserStage.QUIZ2 ||
      user.stage === UserStage.QUIZ3 ||
      user.stage === UserStage.QUIZ4 ||
      user.stage === UserStage.QUIZ5
    ) {
      // 把答案存起來
      user.resultArr.push(message);
      return;
    }

    // 如果user.stage是ENTRY 且 message是開始測驗!!! 就把user.stage改成QUIZ1
    if (user.stage === UserStage.ENTRY && message === '開始測驗!!!') {
      user.stage = UserStage.QUIZ1;
    }
  }

  // 取得使用者回答哪個選項最多次
  getMostAnswer(user: User): string {
    // 把使用者的答案轉成物件
    const resultObj = user.resultArr.reduce((acc, cur) => {
      if (acc[cur]) {
        acc[cur]++;
      } else {
        acc[cur] = 1;
      }
      return acc;
    }, {});

    // 把物件轉成陣列
    const resultArr = Object.entries(resultObj);

    // 把陣列排序
    resultArr.sort((a: any, b: any) => b[1] - a[1]);

    // 回傳答案最多的選項
    return resultArr[0][0];
  }
}
