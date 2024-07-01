import { lastValueFrom, catchError, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DownloadService {

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {};

    async downloadInstagram(url: string) {
        if (url.startsWith('https://www.instagram.com/stories')) {
            const options = {
                method: 'POST',
                url: 'https://instagram-media-api.p.rapidapi.com/media/storiesbyid',
                headers: {
                    'x-rapidapi-key': this.configService.get('RAPID_API_KEY'),
                    'x-rapidapi-host': 'instagram-media-api.p.rapidapi.com',
                    'Content-Type': 'application/json',
                },
                data: {
                    url,
                },
            };

            const response = await lastValueFrom(this.httpService.request(options)
                .pipe(
                    map(response => response.data.data.xdt_api__v1__media__shortcode__web_info.items[0]),
                    catchError(error => {
                        throw new Error('Ошибка при запросе');
                    }),
                ));

            return response;
        };
        
        if (url.startsWith('https://www.instagram.com/p') || url.startsWith('https://www.instagram.com/reels')) {
            const options = {
                method: 'POST',
                url: 'https://instagram-bulk-scraper-latest.p.rapidapi.com/media_download_from_url',
                headers: {
                    'x-rapidapi-key': this.configService.get('RAPID_API_KEY'),
                    'x-rapidapi-host': 'instagram-bulk-scraper-latest.p.rapidapi.com',
                    'Content-Type': 'application/json',
                },
                data: {
                    url,
                },
            };

            const response = await lastValueFrom(this.httpService.request(options)
                .pipe(
                    map(response => response.data.data),
                    catchError(error => {
                        throw new Error('Ошибка при запросе');
                    }),
                ));

                return response;
        };
    };

    async downloadTikTok(url: string) {
        const options = {
            method: 'GET',
            url: 'https://tiktok-download-video1.p.rapidapi.com/getVideo',
            params: { url: url, hd: '1' },
            headers: {
                'x-rapidapi-key': this.configService.get('RAPID_API_KEY'),
                'x-rapidapi-host': 'tiktok-download-video1.p.rapidapi.com'
            },
        };

        const response = await lastValueFrom(this.httpService.request(options)
            .pipe(
                map(response => response.data.data),
                catchError(error => {
                    console.error(error);
                    throw new Error('Ошибка при запросе ' + error);
                }),
            ));

        return response;
    };
};