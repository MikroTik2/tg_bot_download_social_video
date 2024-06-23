import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('api/webhook')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) {}

    @Post()
    async handleUpdate(@Body() update: any) {
        await this.telegramService.handleUpdate(update);
        return { status: 'ok' };
    }
}