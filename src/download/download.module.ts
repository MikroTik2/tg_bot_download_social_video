import { DownloadService } from '../download/download.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        HttpModule,    
    ],
    
    providers: [DownloadService],
    exports: [DownloadService],
})

export class DownloadModule {};