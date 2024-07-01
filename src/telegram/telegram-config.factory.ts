import { TelegrafModuleAsyncOptions, TelegrafModuleOptions } from "nestjs-telegraf";
import { ConfigService } from "@nestjs/config";

const telegrafModuleOptions = (config: ConfigService): TelegrafModuleOptions => {
     return {
          token: config.get('TELEGRAM_BOT_TOKEN'),
          launchOptions: {
               dropPendingUpdates: true,
               webhook: {
                    domain: 'tg-bot-download-social-video.vercel.app',
                    port: 4000,
                    path: '/webhook',
                    maxConnections: 10,
               }
          }
     };
};

export const options = (): TelegrafModuleAsyncOptions => {
     return {
          inject: [ConfigService],
          useFactory: (config: ConfigService) => telegrafModuleOptions(config)
     };
};