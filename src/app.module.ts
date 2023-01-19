import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BotService } from './bot/bot.service';
import { ConfigModule } from '@nestjs/config';
import { QuizService } from './quiz/quiz.service';
import { UserService } from './user/user.service';
import { UserStorageService } from './session/userStorage.service';
import { StageService } from './stage/stage.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    BotService,
    QuizService,
    UserService,
    UserStorageService,
    StageService,
  ],
})
export class AppModule {}
