import { Injectable } from "@nestjs/common";
import { Post } from "src/posts/posts.model";
import { Challenge } from "../challenges/challenge.model";
import { UsersService } from "./users.service";

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
    const userIdToUserDetails = {};
    for (const post of posts) {
      if (userIdToUserDetails[post.createdBy._id]) {
        post.createdBy = userIdToUserDetails[post.createdBy._id]
      } else {
        post.createdBy = await this.usersService.findUserById(post.createdBy._id);
      }
    }
  }
}