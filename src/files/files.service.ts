import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { MongoGridFS } from "mongo-gridfs";
import { Connection } from "mongoose";
import * as admin from "firebase-admin";

@Injectable()
export class FilesService {
  // private fileModel: MongoGridFS;

  // // constructor(@InjectConnection() private readonly connection: Connection) {
  // //   this.fileModel = new MongoGridFS(this.connection.db, "Challenges");
  // // }

  // // async deleteFile(id: string): Promise<boolean> {
  // //   return await this.fileModel.delete(id);
  // // }
  constructor() {}

  uploadFile(filePath: string) {
    return admin
      .storage()
      .bucket()
      .upload(filePath, { destination: `uploads/${filePath}` });
  }
}
