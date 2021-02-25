import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FilesService {
  constructor() {}

  async uploadFile(fileToUpload: any) {
    try {
      const file = admin.storage().bucket().file(fileToUpload.originalname);
      await file.save(fileToUpload.buffer);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2500",
      });
      console.log(`media url = ${url}`);
      return url;
    } catch (e) {
      console.log(`Unable to upload encoded file ${e}`);
    }
  }
}
