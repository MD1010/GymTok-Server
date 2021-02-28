import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LinkPredictionResponse } from './linkPrediction.model';

@Injectable()
export class LinkPredictionService {
  linkPredictionServiceUrl: string;
  constructor(private configService: ConfigService,
    private httpService: HttpService) {
    this.linkPredictionServiceUrl = this.configService.get<string>("LINK_PREDICTION_SERVICE_URL");
  }

  getLinkPredictionCalculationResult(userId: string): Promise<LinkPredictionResponse> {
    return this.httpService.get(`${this.linkPredictionServiceUrl}/recommendedChallenges/${userId}`).toPromise().then(res => {
      return res.data;
    })
  }

  initModelTraining(data: string) {
    return this.httpService.post(`${this.linkPredictionServiceUrl}/initModelTraining`, { data }).toPromise();
  }
}
