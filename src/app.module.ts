import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BotService } from './bot/bot.service';
import { ConfigModule } from '@nestjs/config';
import { QuizService } from './quiz/quiz.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [BotService, QuizService],
})
export class AppModule {}
