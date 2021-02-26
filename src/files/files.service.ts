import { HttpService, Injectable } from "@nestjs/common";
import axios from "axios";

import multer from "multer";
// const MovieParser = require("node-video-lib").MovieParser;
@Injectable()
export class FilesService {
  constructor() {}

  async uploadFile(fileBuffer) {
    var FormData = require("form-data");
    const formData = new FormData();
    formData.append("uplodedFile", fileBuffer, { filename: "originalFileName" });
    const headers = {
      ...formData.getHeaders(),
      "Content-Length": formData.getLengthSync(),
      "Content-Type": "multipart/form-data",
    };
    await axios.post("http://localhost:8000/upload-video", formData, {
      headers,
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    });
  }
}
