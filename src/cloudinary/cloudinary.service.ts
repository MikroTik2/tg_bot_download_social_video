import { Injectable, BadRequestException } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
     constructor() {
          cloudinary.config({
               cloud_name: process.env.CLOUDINARY_API_NAME,
               api_key: process.env.CLOUDINARY_API_KEY,
               api_secret: process.env.CLOUDINARY_API_SECRET
          });
     };

     private readonly options_video = {
          folder: 'video',
          fetch_format: "mp4",
          width: 446,
          height: 793,
          resource_type: 'video',
     };

     private readonly options_audio = {
          folder: 'audio',
          fetch_format: "mp3",
          resource_type: 'video',
     };

     private async uploadFile(file: any, options?: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          try {
               return await cloudinary.uploader.upload(file, options);
          } catch (err) {
               throw new BadRequestException(`Failed to upload file from Cloudinary: ${err.message}`);
          };
     };

     async uploadVideo(video: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.uploadFile(video, this.options_video);
     };

     async uploadAudio(audio: any): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return this.uploadFile(audio, this.options_audio);
     };
};