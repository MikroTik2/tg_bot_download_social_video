import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const bot = await app.get(TelegramService);

    app.use('/webhook', () => {
        const res = bot.telegram.getWebhookInfo();
        console.log(res);
    });

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
