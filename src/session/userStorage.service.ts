import { Injectable } from '@nestjs/common';
import { UserStage } from 'src/enum/enum';
import { StageService } from 'src/stage/stage.service';
import { User } from 'src/user/user.interface';

@Injectable()
export class UserStorageService {
  // 儲存使用者資料
  usersStorage = {};
  constructor(private stageService: StageService) {}

  // 更新使用者的下一個stage狀態
  updateUserNextStage(userId: string): void {
    // 取得使用者資料
    const user = this.getUser(userId);
    // 更新使用者的stage狀態
    const nextStage = this.stageService.getNextStage(user.stage);
    user.stage = nextStage;
    return;
  }

  // 新增使用者的答案
  addUserResult(userId: string, result: string): void {
    const user = this.getUser(userId);
    user.resultArr.push(result);
    return;
  }

  // 取得使用者資料
  getUser(userId: string): User {
    // 如果沒有使用者資料就建立
    if (!this.usersStorage[userId]) {
      // 建立使用者資料
      this.usersStorage[userId] = {
        lineId: userId,
        stage: UserStage.ENTRY as UserStage,
        resultArr: [], // 紀錄使用者的答案
        customLineId: null, // 使用者自訂的lineId e.g. @user
        email: null,
        name: null,
      };
    }
    return this.usersStorage[userId];
  }

  // 更新使用者email
  updateUserEmail(userId: string, email: string) {
    const user = this.getUser(userId);
    user.email = email;
  }

  // 更新使用者name
  updateUserName(userId: string, name: string) {
    const user = this.getUser(userId);
    user.name = name;
  }
}
