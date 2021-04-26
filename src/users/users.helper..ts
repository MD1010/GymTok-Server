import { Injectable } from "@nestjs/common";
import { Post } from "src/posts/posts.model";
import { Challenge } from "../challenges/challenge.model";
import { UsersService } from "./users.service";
import * as _ from 'lodash'

@Injectable()
export class UsersHelper {
  constructor(private usersService: UsersService) {
  }
  async addCreatedUserToChallenges(challenges: Challenge[]) {
    const userIdToUserDetails = {};
    for (const challenge of challenges) {
      if (userIdToUserDetails[challenge.createdBy._id]) {
        challenge.createdBy = userIdToUserDetails[challenge.createdBy._id]
      } else {
        challenge.createdBy = await this.usersService.findUserById(challenge.createdBy._id);
      }
    }
  }

  async addCreatedUserToPosts(posts: Post[]) {
    const usersIds = _.uniq(posts.map(post => post.createdBy._id));
    const users = await this.usersService.findUsersByIds(usersIds);
    const userIdToUserDetails = {};
    for (const post of posts) {
      const user = users.find(user => user._id === post.createdBy._id);
      if (user) {
        post.createdBy = user;
      }
    }
  }
}