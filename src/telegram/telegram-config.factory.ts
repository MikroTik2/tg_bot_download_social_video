import { ConfigService } from "@nestjs/config";
import { TelegrafModuleAsyncOptions, TelegrafModuleOptions } from "nestjs-telegraf";

const telegrafModuleOptions = (config: ConfigService): TelegrafModuleOptions => {
            return {
                        token: config.get('TELEGRAM_BOT_TOKEN'),
                        launchOptions: {
                                    dropPendingUpdates: true,
                                    webhook: {
                                                domain: 'https://tg-bot-download-social-video.vercel.app',
                                                path: '/webhook'
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