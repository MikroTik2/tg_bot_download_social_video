import { Ctx, Message, On, Start, Help, Update } from "nestjs-telegraf";
import { CloudinaryService } from "@/cloudinary/cloudinary.service";
import { DownloadService } from '@/download/download.service';
import { ConfigService } from "@nestjs/config";
import { OnModuleInit } from "@nestjs/common";
import { Scenes, Telegraf  } from "telegraf";
import axios from 'axios';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> implements OnModuleInit {
    constructor(
        private readonly config: ConfigService,
        private readonly download: DownloadService,
        private readonly cloudinary: CloudinaryService,
    ) {
        super(config.get('TELEGRAM_BOT_TOKEN'));
    };

    async onModuleInit() {

        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteWebhook`);
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook?url=https://tg-bot-download-social-video.vercel.app/webhook`)

        await this.launch({
            dropPendingUpdates: true,
            webhook: {
                domain: 'tg-bot-download-social-video.vercel.app',
                port: 4000,
                path: '/webhook',
                maxConnections: 10,
            }
        });
    };

    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.replyWithHTML(`
            👋 Привет - <strong>${ctx.from.first_name}</strong>! Скинь сюда ссылку и я сделаю ВСЕ не я реально сдела ВСЕ надо будет сосать буду сосать если еще надо будет что сделать сделаю я вообще без понятия АХАХАХА ААХХАА Я СКУФ Я АРИСТОКРАТ Я ШУТНИК Я ДЖОКЕР.
        `);
    };

    @Help()
    async onHelp(@Ctx() ctx: Context) {
        await ctx.replyWithHTML(
            `⁉️<b> Если у тебя есть проблемы.</b> \n✉️ <b>Напишите мне</b> <a href='https://t.me/d16ddd348'>@d16ddd348</a><b>.</b>`
        );
    };

    @On('text')
    async onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
        if (message.startsWith('https://www.tiktok.com/') || message.startsWith('https://vm.tiktok.com/')) {
            await ctx.replyWithHTML(`<code>Сообщение принял. Жду ответа от сервера...</code>`);
            const info = await this.download.downloadTikTok(message);

            const audio = await this.cloudinary.uploadAudio(info.music);
            const video = await this.cloudinary.uploadVideo(info.play);

            const size = video.bytes / 1048576;

            if (info.images) {

                const media = info.images.map((image, index) => ({
                    type: 'photo',
                    media: { url: image },
                    parse_mode: index === 0 ? 'HTML' : '',
                    caption: index === 0 
                        ? `
Заголовок: <code>${info.title}</code>,
Регион: <code>${info.region}</code>,
Видео ID: <code>${info.id}</code>,
Автор ID: <code>${info.author.id}</code>,
Автор UniqueId: <code>${info.author.unique_id}</code>,
Автор Nickname: <code>${info.author.nickname}</code>,
Автор Avatar: <a href="${info.author.avatar}">ссылка</a>,
Количество комментариев: <code>${info.comment_count}</code>,
                        `
                        : '',
                }))

                ctx.replyWithMediaGroup(media);
                await ctx.sendAudio({ url: audio.secure_url }, {
                    caption: `
Название песни: <code>${info.music_info.title || 'не найдено'}</code>,
Название альбома: <code>${info.music_info.album || 'не найдено'}</code>,
Длина видео: <code>${info.duration}</code>,
                    `, parse_mode: 'HTML',
                });
            } else {
                await ctx.replyWithVideo({ url: video.secure_url }, { 
                    caption: `
Заголовок: <code>${info.title}</code>,
Регион: <code>${info.region}</code>,
Видео ID: <code>${info.id}</code>,
Автор ID: <code>${info.author.id}</code>,
Автор UniqueId: <code>${info.author.unique_id}</code>,
Автор Nickname: <code>${info.author.nickname}</code>,
Автор Avatar: <a href="${info.author.avatar}">ссылка</a>,
Размер видео: <code>${size.toFixed(1)}MB</code>,
Количество комментариев: <code>${info.comment_count}</code>,
                    `, parse_mode: 'HTML'
                });
    
                await ctx.sendAudio({ url: audio.secure_url }, {
                    caption: `
Название песни: <code>${info.music_info.title || 'не найдено'}</code>,
Название альбома: <code>${info.music_info.album || 'не найдено'}</code>,
                    `, parse_mode: 'HTML',
                });
            };

        } else if (message.startsWith('https://www.instagram.com/')) {
            await ctx.replyWithHTML(`<code>Сообщение принял. Жду ответа от сервера...</code>`);
            const info = await this.download.downloadInstagram(message);

            const videoUrl = Array.isArray(info?.video_versions) && info.video_versions.length > 0 ? info.video_versions[0].url : info?.main_media_hd;
            const video = await this.cloudinary.uploadVideo(videoUrl);
            const size =  video.bytes / 1048576;

            await ctx.replyWithVideo({ url: video.secure_url }, {
                caption: `
Никнейм: <code>${info?.user?.username || info?.owner?.username}</code>,
Полное имя: <code>${info?.user?.full_name || info?.owner?.full_name}</code>,
Аватарка Автора: <a href="${info?.owner?.profile_pic_url}">ссылка</a>
Тип видео: <code>${info?.product_type || info?.main_media_type}</code>,
Размер файла: <code>${size.toFixed(1)}MB</code>,
                `, parse_mode: 'HTML',

            });

        } else {
            await ctx.replyWithHTML(`Ошибка видое не найдено проверь URL: <code>${message}</code>`);
        };
    };
};