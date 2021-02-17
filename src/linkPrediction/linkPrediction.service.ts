import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkPredictionService {
  linkPredictionServiceUrl: string;
  constructor(private configService: ConfigService,
    private httpService: HttpService) {
    this.linkPredictionServiceUrl = this.configService.get<string>("LINK_PREDICTION_SERVICE_URL");
  }

  getRecommendedChallengesByUserId(userId: string) {
    return this.httpService.get(`${this.linkPredictionServiceUrl}/recommendedChallenges/${userId}`).toPromise().then(res => {
      console.log("eeee", res.data);
      return res.data;
    })
  }

  initModelTraining(data: string) {
    this.httpService.post(`${this.linkPredictionServiceUrl}/initModelTraining`, { data }).toPromise().then(res => {
      // console.log("eeee", res.data);
    })

    return "soon"
  }
}
