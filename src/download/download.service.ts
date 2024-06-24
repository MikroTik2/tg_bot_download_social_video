import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';

@Injectable()
export class DownloadService {

    private insta_api = 'https://instagram-story-downloader-media-downloader.p.rapidapi.com/index';
    private tt_api = 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index';

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {};
            
    async downloadYouTube(url: string, format: string): Promise<any> {
        if (url?.startsWith('https://www.youtube.com/')) {

            const info = await ytdl.getInfo(url);

            const filePath = `${info.videoDetails.videoId}.${format}`;
            const videoStream = ytdl(url, { filter: "audio", quality: "highestvideo" });

            await new Promise((resolve, reject) => {
                const writableStream = fs.createWriteStream(filePath);
                videoStream.pipe(writableStream);
                writableStream.on('finish', resolve);
                writableStream.on('error', reject);
            });

            return { 
                path: filePath, 
                info_video: info.videoDetails,
                author: info.videoDetails.author
            };

        } else {
            return { error: 'Неверный URL: ' + url };
        };
    };

    async downloadInstagram(url: string) {
        if (url.startsWith('https://www.instagram.com/')) {
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
        } else {
            return { error: 'Неверный URL: ' + url };  
        };
    };

    async downloadTikTok(url: string) {
        if (url.startsWith('https://www.tiktok.com/')) {

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

        } else {
            return { error: 'Неверный URL: ' + url };  
        };
    };
};