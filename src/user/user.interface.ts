import { UserStage } from 'src/enum/enum';

export interface User {
  stage: UserStage;
  score: number;
  resultArr: string[];
  animal: string;
}
