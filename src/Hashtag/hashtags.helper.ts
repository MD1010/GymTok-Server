import { Injectable } from "@nestjs/common";
import { Post } from "src/posts/posts.model";
import { HashtagsService } from "./hashtags.service";
import { HashtagDto } from "./hashtags.model";
import { Types } from 'mongoose'

@Injectable()
export class HashtagsHelper {
  constructor(private hashtagsService: HashtagsService) {
  }

  async addHashtagsToPosts(posts: Post[]) {
    const hashtags = await this.hashtagsService.findAllHashtags();
    for (const post of posts) {
      let postHashtags = [];
      for (const postHash of post.hashtags) {
        const hashtag = hashtags.find(hash => hash._id.equals(postHash));
        if (hashtag) {
          postHashtags.push(hashtag);
        }
      }
      post.hashtags = postHashtags;
    }
  }

  getPostsPerHashtag(posts: Post[], hashtags: HashtagDto[]) {
    const postsPerHashtag = {};

    for (const hashtag of hashtags) {
      postsPerHashtag[hashtag.hashtag] = [];

      for (const post of posts) {
        if (post.hashtags.includes(Types.ObjectId(hashtag._id))) {
          postsPerHashtag[hashtag.hashtag].push(post)
        }
      }
    }
    return postsPerHashtag;
  }

  getPopularHashtags(postsPerHashtag: any, popularCount: number) {
    const sortedHashtags = Object.keys(postsPerHashtag).sort((a, b) => postsPerHashtag[b].length - postsPerHashtag[a].length);

    const popularHashtags = sortedHashtags.slice(0, popularCount);

    return popularHashtags.reduce((popularPostsPerHashtag, hashtag) => {
      popularPostsPerHashtag[hashtag] = postsPerHashtag[hashtag];

      return popularPostsPerHashtag;
    }, {})
  }
}