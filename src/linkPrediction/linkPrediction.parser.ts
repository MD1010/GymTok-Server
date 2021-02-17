import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.model';

@Injectable()
export class LinkPredictionParser {

  parseUsersAndChallengesToLinkPredictionFormat(users: User[]) {
    let bipartiteGraph: string = "";
    for (const user of users) {
      for (const acceptedChallengeId of user.acceptedChallenges) {
        bipartiteGraph += `${user.username},${acceptedChallengeId}\n`;
      }
    }

    return bipartiteGraph.trim();
  }
}
