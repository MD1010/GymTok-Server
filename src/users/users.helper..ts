import { Injectable } from "@nestjs/common";
import { Post } from "src/posts/posts.model";
import { UsersService } from "./users.service";
import * as _ from 'lodash'

@Injectable()
export class UsersHelper {
  constructor(private usersService: UsersService) {
  }

  async addCreatedUserToPosts(posts: Post[]) {
    const usersIds = _.uniq(posts.map(post => post.createdBy._id));
    const users = await this.usersService.findUsersByIds(usersIds);
    for (const post of posts) {
      const user = users.find(user => user._id === post.createdBy._id);
      if (user) {
        post.createdBy = user;
      }
    }
  }
}