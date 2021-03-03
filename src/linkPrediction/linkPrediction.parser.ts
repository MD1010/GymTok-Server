import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Challenge } from 'src/challenges/challenge.model';
import { Reply } from 'src/Replies/replies.model';
import { User } from 'src/users/user.model';

@Injectable()
export class LinkPredictionParser {

  parseUsersAndChallengesToLinkPredictionFormat(challenges: Challenge[], replies: Reply[]) {
    let bipartiteGraph = "";
    let usersPerChallenges = {};
    for (const challenge of challenges) {
      usersPerChallenges[challenge.createdBy._id] = [challenge._id];
    }

    for (const reply of replies) {
      if (usersPerChallenges[reply.replierId._id]) {
        usersPerChallenges[reply.replierId._id].push(reply.challengeId._id);
      } else {
        usersPerChallenges[reply.replierId._id] = [reply.challengeId._id];
      }
    }

    for (const userId in usersPerChallenges) {
      for (const challengeId of usersPerChallenges[userId]) {
        bipartiteGraph += `${userId},${challengeId}\n`;
      }
    }

    return bipartiteGraph.trim();
  }
}
