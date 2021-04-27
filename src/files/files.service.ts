import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as FormData from "form-data";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FilesService {
  constructor() { }

  async uploadFile(fileBuffer) {
    const formData = new FormData();
    formData.append("uplodedFile", fileBuffer, {
      filename: `${uuidv4()}.mp4`,
    });
    const headers = {
      ...formData.getHeaders(),
      "Content-Length": formData.getLengthSync(),
      "Content-Type": "multipart/form-data",
    };
    let locations = await axios.post(`${process.env.STREAMING_SERVER_ENPOINT}/upload-video`, formData, {
      headers,
      maxContentLength: Number.MAX_SAFE_INTEGER,
      maxBodyLength: Number.MAX_SAFE_INTEGER,
    });
    console.log("-- upload success ---");
    return locations.data;
  }
}
