import { Injectable } from '@nestjs/common';
import { TOP_RECOMMENDED_CHALLENGES_PERCENT_TO_RETURN } from './linkPrediction.consts';
import { LinkPredictionResponse } from './linkPrediction.model';

@Injectable()
export class LinkPredictionHelper {

  getMostRecommendedChallenges(challengesAndTheirRecommendPercent: LinkPredictionResponse) {
    const recommendedChallenges = [];
    const percents = Object.values(challengesAndTheirRecommendPercent).sort()
    const minimumRecmommendedPrecentToReturnChallenge = percents[Math.floor((1 - TOP_RECOMMENDED_CHALLENGES_PERCENT_TO_RETURN) * percents.length)];

    for (const challengeId in challengesAndTheirRecommendPercent) {
      if (challengesAndTheirRecommendPercent[challengeId] >= minimumRecmommendedPrecentToReturnChallenge) {
        recommendedChallenges.push(challengeId.trim());
      }
    }

    return recommendedChallenges;
  }
}
