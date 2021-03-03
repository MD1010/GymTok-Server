import { HttpService, Injectable } from "@nestjs/common";
import axios from "axios";
import * as FormData from "form-data";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// const MovieParser = require("node-video-lib").MovieParser;
@Injectable()
export class FilesService {
  constructor() {}

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
    let videoLocation = await axios.post(`${process.env.STREAMING_SERVER_ENPOINT}/upload-video`, formData, {
      headers,
      maxContentLength: Number.MAX_SAFE_INTEGER,
      maxBodyLength: Number.MAX_SAFE_INTEGER,
    });
    return videoLocation;
  }
}
