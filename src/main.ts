import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const bot = app.get(TelegramService)

    app.use(`/webhook`, (req, res) => {
        console.log('it works')

        bot.telegram.sendMessage('7397995791', 'sdfsdfsd')
        res.sendStatus(200);  
    });

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
