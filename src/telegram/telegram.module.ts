import { CloudinaryModule } from "@/cloudinary/cloudinary.module";
import { TelegramService } from "@/telegram/telegram.service";
import { options } from "@/telegram/telegram-config.factory";
import { DownloadModule } from "@/download/download.module";
import { TelegrafModule } from "nestjs-telegraf";
import { Module } from "@nestjs/common";

@Module({
     imports: [
          TelegrafModule.forRootAsync(options()),
          DownloadModule,
          CloudinaryModule,
     ],
     
     providers: [TelegramService],
})

export class TelegramModule {};