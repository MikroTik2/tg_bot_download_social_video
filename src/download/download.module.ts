import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';

@Module({
    imports: [HttpModule],
    providers: [DownloadService],
    exports: [DownloadService],
})
export class DownloadModule {}