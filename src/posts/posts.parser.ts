import { Injectable } from "@nestjs/common";
import { PostDto } from "./posts.model";

@Injectable()
export class PostsParser {
  parsePostFileDataToPost(formDataFields: any, isReply: boolean): PostDto {
    const parsedPost = {
      description: JSON.parse(formDataFields.description),
      createdBy: formDataFields.createdBy,
      taggedUsers:
        formDataFields.taggedUsers && formDataFields.taggedUsers !== "undefined"
          ? JSON.parse(formDataFields.taggedUsers)
          : [],
      likes: [],
      hashtags:
        formDataFields.hashtags && formDataFields.hashtags !== "undefined" ? JSON.parse(formDataFields.hashtags) : [],
      isReply,
      videoURI: "",
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
