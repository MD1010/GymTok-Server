import { Injectable, HttpService } from '@nestjs/common';
import { Post } from 'src/posts/posts.model';

@Injectable()
export class LinkPredictionParser {

  postsToLinkPredictionFormat(posts: Post[]) {
    let bipartiteGraph = "";
    let usersPerPosts = {};
    for (const post of posts) {
      if (!post.isReply) {
        const createdById = post.createdBy.toString();
        if (usersPerPosts[createdById]) {
          usersPerPosts[createdById].push(post._id)
        } else {
          usersPerPosts[createdById] = [post._id];
        }
      }
    }

    for (const post of posts) {
      if (post.isReply) {
        const createdById = post.createdBy.toString();
        const originalPost = posts.find(po => po.replies.includes(post._id));
        if (originalPost) {
          if (usersPerPosts[createdById]) {
            usersPerPosts[createdById].push(originalPost._id)
          } else {
            usersPerPosts[createdById] = [originalPost._id];
          }
        }
      }
    }

    for (const userId in usersPerPosts) {
      for (const challengeId of usersPerPosts[userId]) {
        bipartiteGraph += `${userId},${challengeId}\n`;
      }
    }

    return bipartiteGraph.trim();
  }
}
