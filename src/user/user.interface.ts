import { UserStage } from 'src/enum/enum';

export interface User {
  stage: UserStage;
  resultArr: string[];
  animal: string;
  email: string;
  name: string;
}
