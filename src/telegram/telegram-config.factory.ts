import { ConfigService } from "@nestjs/config";
import { TelegrafModuleAsyncOptions, TelegrafModuleOptions } from "nestjs-telegraf";

const telegrafModuleOptions = (config: ConfigService): TelegrafModuleOptions => {
            return {
                        token: config.get('TELEGRAM_BOT_TOKEN'),
                        launchOptions: {
                                    dropPendingUpdates: true,
                                    webhook: {
                                                domain: 'telegram-bot-api-download.vercel.app',
                                                hookPath: '/webhook',
                                    },
                        },
            };
};

export const options = (): TelegrafModuleAsyncOptions => {
            return {
                        inject: [ConfigService],
                        useFactory: (config: ConfigService) => telegrafModuleOptions(config)
            };
};