import { Controller, Post, Req } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Post()
  handleWebhook(@Req() req: Request) {
    console.log(req.body);
    return 'Webhook received';
  }
}
