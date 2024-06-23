import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { TelegramService } from "@/telegram/telegram.service";
import { options } from "@/telegram/telegram-config.factory";
import { DownloadModule } from "@/download/download.module";
import { TelegramController } from "@/telegram/telegram.controller";

@Module({
            imports: [
                        TelegrafModule.forRootAsync(options()),

                        DownloadModule,
            ],
            controllers: [TelegramController],
            providers: [TelegramService],
})

export class TelegramModule {};