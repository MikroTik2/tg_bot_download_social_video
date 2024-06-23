import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(`/webhook`, (req, res) => {
        console.log('it works')
        res.sendStatus(200);  
    });

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
