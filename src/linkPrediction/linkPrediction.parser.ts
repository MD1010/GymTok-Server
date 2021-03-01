import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Challenge } from 'src/challenges/challenge.model';
import { User } from 'src/users/user.model';

@Injectable()
export class LinkPredictionParser {

  parseUsersAndChallengesToLinkPredictionFormat(challenges: Challenge[]) {
    let bipartiteGraph: string = "";
    for (const challenge of challenges) {
      bipartiteGraph += `${challenge.createdBy},${challenge._id}\n`;
    }

    return bipartiteGraph.trim();
  }
}
