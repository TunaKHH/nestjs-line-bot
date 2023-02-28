import { Post, Controller, Res, Req, HttpStatus } from '@nestjs/common';

import { BotService } from './bot/bot.service';

@Controller()
export class AppController {
  constructor(private botService: BotService) {}

  @Post('callback')
  getHello(@Res() res, @Req() req) {
    // 丟給botService處理
    req.body.events.flatMap((event) => {
      return this.botService.handleEvent(event);
    });
    res.status(HttpStatus.OK).send('Bot service is working');
  }
}
