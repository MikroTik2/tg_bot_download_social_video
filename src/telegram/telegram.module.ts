import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { TelegramService } from "../telegram/telegram.service";
import { options } from "../telegram/telegram-config.factory";
import { DownloadModule } from "../download/download.module";
import { WebhookController } from "./telegram.controller";

@Module({
            imports: [
                        TelegrafModule.forRootAsync(options()),
                        DownloadModule,
            ],
            
            controllers: [WebhookController],
            providers: [TelegramService],
})

export class TelegramModule {};