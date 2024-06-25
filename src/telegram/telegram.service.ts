import { ConfigService } from "@nestjs/config";
import { Ctx, Message, On, Start, Help, Action, Update } from "nestjs-telegraf";
import { Scenes, Telegraf  } from "telegraf";
import { DownloadService } from '../download/download.service';
import { OnModuleInit } from "@nestjs/common";

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> implements OnModuleInit {

            private _message;

            constructor(
                        private readonly config: ConfigService,
                        private readonly download: DownloadService,
            ) {
                        super(config.get('TELEGRAM_BOT_TOKEN'));
            };

            async onModuleInit() {
                await this.createWebhook({
                    domain: 'tg-bot-download.vercel.app',
                    drop_pending_updates: true,
                    path: '/webhook',
                })
            };

            @Start()
            async onStart(@Ctx() ctx: Context) {
                        await ctx.replyWithHTML(`👋 Привет - <strong>${ctx.from.first_name}</strong>! Скинь сюда ссылку и я сделаю ВСЕ не я реально сделаю ВСЕ надо будет сосать буду сосать если еще надо будет что сделать сделаю я вообще без понятия АХАХАХА ААХХАА Я СКУФ Я АРИСТОКРАТ Я ШУТНИК Я ДЖОКЕР.`);
            };

            @Help()
            async onHelp(@Ctx() ctx: Context) {
                        await ctx.replyWithHTML("⁉️<b> Если у тебя есть проблемы.</b> \n✉️ <b>Напишите мне</b> <a href='https://t.me/d16ddd348'>@d16ddd348</a><b>.</b>");
            };

            @Action('format_mp3')
            async sendMp3Video(@Ctx() ctx: Context) {
                        await ctx.replyWithHTML(`<code>Сообщение принял. Жду ответа от сервера...</code>`);

                        const info = await this.download.downloadYouTube(this._message);
                        if (info.error) await ctx.replyWithHTML(info.error);

                        await ctx.sendAudio({ source: info.path }, {
                                    caption: `
Название видоса: ${info.info_video.title},
Автор: ${info.author.name},
Ссылка: ${info.author.channel_url},
Ссылка на видео: ${info.info_video.video_url},
Просмотров: ${info.info_video.viewCount},            
Категория: ${info.info_video.category},            
Создание видоса: ${info.info_video.publishDate},            
                                    `,
                        });
            };

            @Action('format_mp4')
            async sendMp4Video(@Ctx() ctx: Context) {
                        await ctx.replyWithHTML(`<code>Сообщение принял. Жду ответа от сервера...</code>`);

                        const info = await this.download.downloadYouTube(this._message);
                        if (info.error) await ctx.replyWithHTML(info.error);

                        await ctx.replyWithVideo({ source: info.path }, {
                                    caption: `
Название видоса: ${info.info_video.title},
Автор: ${info.author.name},
Ссылка: ${info.author.channel_url},
Ссылка на видео: ${info.info_video.video_url},
Просмотров: ${info.info_video.viewCount},            
Категория: ${info.info_video.category},            
Создание видоса: ${info.info_video.publishDate},            
                                    `,
                        });
            };

            @On('text')
            async onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
                        if (message.startsWith('https://www.youtube.com/') || message.startsWith('https://youtu.be/')) {

                                    await ctx.reply('Выберите формат для скачивания:', {
                                                reply_markup: {
                                                            inline_keyboard: [
                                                            [{ text: 'MP4', callback_data: 'format_mp4' }],
                                                            [{ text: 'MP3', callback_data: 'format_mp3' }],
                                                            ],
                                                },
                                    });

                                    this._message = message;
                        };

                        if (message.startsWith('https://www.tiktok.com/')) {
                                    await ctx.replyWithHTML(`<code>Сообщение принял. Жду ответа от сервера...</code>`);
                                    const info = await this.download.downloadTikTok(message);

                                    await ctx.replyWithVideo(info.video[0], {
                                                caption: `
Описание: ${info.description[0]},
Автор: ${info.author[0]},
Регион: ${info.region[0]},
Видео ID: ${info.videoid[0]},
                                                `
                                    });

                                    await ctx.sendAudio(info.music[0])
                        };
                        
                        if (message.startsWith('https://www.instagram.com/')) {
                                    await ctx.replyWithHTML(`<code>Сообщение принял. Жду ответа от сервера...</code>`);
                                    const info = await this.download.downloadInstagram(message);

                                    await ctx.replyWithVideo(info.media || info.stories[0].media, {
                                                caption: `
Автор: ${info.title || info.username}
Пользыватель ID: ${info.user_id || 'не найден'}
                                                `
                                    });
                        };
            };
};