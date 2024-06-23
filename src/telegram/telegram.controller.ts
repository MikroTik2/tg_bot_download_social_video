import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Telegraf } from 'telegraf';

@Controller('api')
export class WebhookController {
  constructor(private readonly bot: Telegraf<any>) {}

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    await this.bot.handleUpdate(req.body);
    res.sendStatus(200);
  }
}
