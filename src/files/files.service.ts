import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import axios from "axios";

import multer from "multer";
const MovieParser = require("node-video-lib").MovieParser;
@Injectable()
export class FilesService {
  constructor() {}

  async uploadFile(fileToUpload: any) {
    // console.log("begin");
    // const storage = multer.diskStorage({
    //   destination: function (req, file, cb) {
    //     cb(null, "videos");
    //   },
    //   filename: function (req, file, cb) {
    //     cb(null, `${file.fieldname}.mp4`);
    //   },
    // });
    // const upload = multer({ storage });
    // let parsedFile = MovieParser.parse(fileToUpload);
    // console.log(parsedFile);
    // upload(parsedFile);
    // // var formData = new FormData();
    // const formData = {
    //   name: "video",
    //   buffer: Buffer.from(fileToUpload),
    // };
    // console.log(formData);
    // console.log("fetching..");
    // let url = await axios.post("http://192.168.1.152:8000/upload-video", {
    //   formData: formData,
    // });
    // let res = await axios.get("http://192.168.1.152:8000/check");
    // console.log(res);

    // try {
    //   const file = admin.storage().bucket().file(fileToUpload.originalname);
    //   await file.save(fileToUpload.buffer);
    //   const [url] = await file.getSignedUrl({
    //     action: "read",
    //     expires: "03-09-2500",
    //   });
    //   console.log(`media url = ${url}`);
    //   return url;
    // } catch (e) {
    //   console.log(`Unable to upload encoded file ${e}`);
    // }
    console.log(fileToUpload);
  }
}
