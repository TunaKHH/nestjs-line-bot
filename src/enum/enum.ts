import { ResultButtonInterface } from 'src/interface';

export enum UserStage {
  NONE,
  ENTRY,
  QUIZ1,
  QUIZ2,
  QUIZ3,
  QUIZ4,
  QUIZ5,
  RESULT_TEST,
  RESULT_EMAIL,
  RESULT_NAME,
  RESULT_SIGNUP,
  RESULT_PHONE,
  RESULT_LINE_ID,
  RESULT_SHARE,
}

export class ResultObject {
  // 報名
  static readonly ANSWER_SIGNUP = new ResultObject('ANSWER_SIGNUP', {
    text: '我要報名公益講座',
  });
  static readonly LINE_SHARE = new ResultObject('LINE_SHARE', {
    text: 'Line分享好友 一起玩測',
    url: 'https://line.me/R/nv/recommendOA/@845ibhra',
  });
  static readonly FACEBOOK_SHARE = new ResultObject('FACEBOOK_SHARE', {
    text: 'Facebook分享好友 一起玩測',
    urls: {
      獅子王: 'https://pse.is/4m3zkr', // 獅子王
      駱駝: 'https://pse.is/4lrnmz', // 駱駝
      北極熊: 'https://pse.is/4n3pu6', // 北極熊
      水母: 'https://pse.is/4mupm4', // 水母
    },
  });

  // private to disallow creating other instances of this type
  private constructor(
    private readonly key: string,
    public readonly value: ResultButtonInterface,
  ) {}

  toString() {
    return this.key;
  }
}
