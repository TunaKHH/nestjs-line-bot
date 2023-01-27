import { UserStage } from 'src/enum/enum';

export interface User {
  /**
   * @param string lineId: line官方使用的user id (較長且不會變)
   */
  lineId: string;
  /**
   * @param string customLineId: 使用者自定義的line id (較短且可能改變)
   */
  customLineId: string;
  /**
   * @param string userKey: 使用者存在資料庫的key
   */
  userKey?: string;
  stage: UserStage;
  resultArr: string[];
  animal: string;
  email: string;
  name: string;
  phone: string;
}
