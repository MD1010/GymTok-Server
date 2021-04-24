import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Challenge } from "src/challenges/challenge.model";
import { Reply, ReplyDto } from "src/Replies/replies.model";
import { User } from "src/users/user.model";
import { PostDto } from "./posts.model";

@Injectable()
export class PostsParser {
  parsePostFileDataToPost(formDataFields: any, isReply: boolean): PostDto {
    const parsedPost = {
      description: formDataFields.description,
      createdBy: formDataFields.createdBy,
      videoURI: formDataFields.videoURI,
      taggedUsers: formDataFields.taggedUsers !== "undefined" ? JSON.parse(formDataFields.taggedUsers) : [],
      likes: formDataFields.likes !== "undefined" ? JSON.parse(formDataFields.likes) : [],
      hashtags: formDataFields.hashtags !== "undefined" ? JSON.parse(formDataFields.hashtags) : [],
      isReply,
      gif: "",
      replies: [],
    };

    return parsedPost;
  }

  addFilesFieldsToPost(post: PostDto, locations: any) {
    post.videoURI = locations.videoID;
    post.gif = locations.gifID;
  }
}
