"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const node_path_1 = require("node:path");
const uuid_1 = require("uuid");
const configs_1 = require("../configs/configs");
class S3Service {
    constructor(client = new client_s3_1.S3Client({
        region: configs_1.configs.AWS_S3_BUCKET_REGION,
        credentials: {
            accessKeyId: configs_1.configs.AWS_S3_ACCESS_KEY,
            secretAccessKey: configs_1.configs.AWS_S3_SECRET_KEY
        }
    })) {
        this.client = client;
    }
    async uploadPhoto(file, itemType, itemId) {
        const filePath = this.buildPath(itemType, itemId, file.name);
        await this.client.send(new client_s3_1.PutObjectCommand({ Bucket: configs_1.configs.AWS_S3_BUCKET_NAME,
            Key: filePath,
            Body: file.data,
            ContentType: file.mimetype,
            ACL: configs_1.configs.AWS_S3_ACL }));
        return `${configs_1.configs.AWS_S3_BUCKET_URL}/${filePath}`;
    }
    async deletePhoto(filePath) {
        await this.client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: configs_1.configs.AWS_S3_BUCKET_NAME,
            Key: filePath,
        }));
    }
    buildPath(fileName, itemType, itemId) {
        return `${itemType}/${itemId}/${uuid_1.v4}/${(0, node_path_1.extname)(fileName)}`;
    }
}
exports.s3Service = new S3Service();
