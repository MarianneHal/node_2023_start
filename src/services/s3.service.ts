import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import{extname} from "node:path";
import {v4} from "uuid";

import {configs} from "../configs/configs";


class S3Service {
    constructor(private client = new S3Client({
        region:configs.AWS_S3_BUCKET_REGION,
        credentials: {
            accessKeyId: configs.AWS_S3_ACCESS_KEY,
            secretAccessKey: configs.AWS_S3_SECRET_KEY
        }
    })
    ){}
    public async uploadPhoto(file:any, itemType:string, itemId:string): Promise<string>{
        const filePath = this.buildPath(itemType,itemId,file.name)
       await this.client.send(
           new PutObjectCommand({Bucket:configs.AWS_S3_BUCKET_NAME,
               Key:filePath,
               Body:file.data,
               ContentType:file.mimetype,
               ACL:configs.AWS_S3_ACL})
       );
       return `${configs.AWS_S3_BUCKET_URL}/${filePath}`
    }
    private buildPath(fileName:string, itemType:string, itemId:string):string{

        return `${itemType}/${itemId}/${v4}/${extname(fileName)}`;
    }
}

export const s3Service = new S3Service();