import { AnimalInterface, ResultButtonInterface } from 'src/interface';

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

export class Animal {
  // 忍者
  static readonly NINJA = new Animal('NINJA', {
    text: '忍者',
    url: 'https://i.imgur.com/0G9qJX8.jpg',
    shareUrl: 'https://pse.is/4pjn7a',
  });
  // 雪寶
  static readonly SNOWMAN = new Animal('SNOWMAN', {
    text: '雪寶',
    url: 'https://i.imgur.com/7I3bKpH.jpg',
    shareUrl: 'https://pse.is/4rjlr4',
  });
  // 悟空
  static readonly MONKEY = new Animal('MONKEY', {
    text: '悟空',
    url: 'https://i.imgur.com/z0v5cak.jpg',
    shareUrl: 'https://pse.is/4pn87b',
  });
  // 阿凡達
  static readonly AVATAR = new Animal('AVATAR', {
    text: '阿凡達',
    url: 'https://i.imgur.com/QdRCniB.jpg',
    shareUrl: 'https://pse.is/4rc8wd',
  });

  // private to disallow creating other instances of this type
  private constructor(
    private readonly key: string,
    public readonly value: AnimalInterface,
  ) {}

  toString() {
    return this.key;
  }
}

export class ResultObject {
  // 報名
  static readonly ANSWER_SIGNUP = new ResultObject('ANSWER_SIGNUP', {
    text: '我要報名公益講座',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSc9cybu27JEVqAIPSgm1rEWSx2jSbw7-bV5pL_3kk3IpJ1REA/viewform',
  });
  static readonly LINE_SHARE = new ResultObject('LINE_SHARE', {
    text: 'Line分享好友 一起玩測',
    url: 'https://line.me/R/nv/recommendOA/@335euuhh',
  });
  static readonly FACEBOOK_SHARE = new ResultObject('FACEBOOK_SHARE', {
    text: 'Facebook分享好友 一起玩測',
    urls: {
      NINJA: 'https://pse.is/4pjn7a',
      SNOWMAN: 'https://pse.is/4rjlr4',
      MONKEY: 'https://pse.is/4pn87b',
      AVATAR: 'https://pse.is/4rc8wd',
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
