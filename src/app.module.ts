import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TelegramModule } from "@/telegram/telegram.module";
import { WebhookController } from "@/webhook/webhook.controller";

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TelegramModule,
  ],

  controllers: [WebhookController],
})

export class AppModule {};
