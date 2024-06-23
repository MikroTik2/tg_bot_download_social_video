import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service'; // Проверьте путь до вашего TelegramService

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const bot = app.get(TelegramService);

    await app.listen(process.env.PORT || 3000);
    try {
        // Установка вебхука
        await bot.telegram.setWebhook('https://tg-bot-download-social-video.vercel.app/webhook');
        console.log('Webhook set successfully.');
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}

bootstrap();
