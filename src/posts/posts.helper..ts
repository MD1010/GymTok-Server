import { Injectable } from "@nestjs/common";
import { Post } from "../posts/posts.model";
import * as _ from 'lodash'
import { UsersHelper } from "../users/users.helper.";
import { HashtagsHelper } from "../Hashtag/hashtags.helper";

@Injectable()
export class PostsHelper {
  constructor(private usersHelper: UsersHelper,
    private hashtagsHelper: HashtagsHelper) { }

  async addParamsToPosts(posts: Post[]) {
    await this.usersHelper.addCreatedUserToPosts(posts);
    await this.hashtagsHelper.addHashtagsToPosts(posts);
  }

}