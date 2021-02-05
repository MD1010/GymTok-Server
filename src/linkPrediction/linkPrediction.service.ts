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
    console.log("aaaa", this.configService.get<string>("LINK_PREDICTION_SERVICE_URL"));

    return "soon"
  }

  initModel() {
    this.httpService.post(`${this.linkPredictionServiceUrl}/initModel`).toPromise().then(res => {
      console.log("eeee", res);
    })

    return "soon"
  }
}
