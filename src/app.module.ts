import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./users/user.module";
import * as config from "./common/config.json";
import { ChallengesModule } from "./challenges/challenges.module";

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URL),
    UserModule,
    ChallengesModule,
  ],
})
export class AppModule {}
