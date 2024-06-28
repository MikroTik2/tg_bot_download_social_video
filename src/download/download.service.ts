import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import ytdl from 'ytdl-core';

@Injectable()
export class DownloadService {
    private insta_api = 'https://instagram-story-downloader-media-downloader.p.rapidapi.com/index';
    private tt_api = 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index';

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {};

    async downloadYouTube(url: string) {
        const info = await ytdl.getInfo(url);
        const size = parseInt(info.formats[0].contentLength || '0', 10);
        const sizeMB = size / 1048576;

        if (parseInt(sizeMB.toFixed(1)) > 50.0) {
            return { limit: 'Превышен лимит скачивания в 50 МБ: размер видео - ' + sizeMB.toFixed(1) + 'МБ' }
        };

        const stream = ytdl(url, { filter: "audio", quality: "highestvideo" });

        return { 
            path: stream, 
            info_video: info.videoDetails,
            author: info.videoDetails.author
        };
    };


    async downloadInstagram(url: string) {
        const options = {
            method: 'GET',
            url: this.insta_api,
            params: {
                url: url
            },
            headers: {
                'X-RapidAPI-Key': this.configService.get('RAPID_API_KEY'),
                'X-RapidAPI-Host': this.configService.get('RAPID_HOST_API_INSTA'),
            },
        };
    
        const response = await lastValueFrom(this.httpService.get(options.url, { params: options.params, headers: options.headers })
            .pipe(
                map(response => response.data),
                catchError(error => {
                    throw new Error('Ошибка при запросе');
                }),
            ));

        return response;
    };

    async downloadTikTok(url: string) {
        const options = {
            method: "GET",
            url: this.tt_api,
            params: {
                url: url,
            },
            headers: {
                "X-RapidAPI-Key": this.configService.get('RAPID_API_KEY'),
                "X-RapidAPI-Host": this.configService.get('RAPID_HOST_API_TT'),
            },
        };

        const response = await lastValueFrom(this.httpService.get(options.url, { params: options.params, headers: options.headers })
            .pipe(
                map(response => response.data),
                catchError(error => {
                    console.error(error);
                    throw new Error('Ошибка при запросе');
                }),
            ));

        return response;
    };
};