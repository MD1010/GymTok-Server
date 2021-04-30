import { Injectable } from "@nestjs/common";
import { Post } from "src/posts/posts.model";
import { HashtagsService } from "./hashtags.service";
import * as _ from 'lodash'

@Injectable()
export class HashtagsHelper {
  constructor(private hashtagsService: HashtagsService) {
  }

  async addHashtagsToPosts(posts: Post[]) {
    const hashtags = await this.hashtagsService.findAllHashtags();
    for (const post of posts) {
      let postHashtags = [];
      for(const postHash of post.hashtags) {
        const hashtag = hashtags.find(hash => hash._id.equals(postHash));
        if (hashtag) {
          postHashtags.push(hashtag);
        }
      }
      post.hashtags = postHashtags;
    }
  }
}