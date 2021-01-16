import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./users/user.module";
import { ChallengesModule } from "./challenges/challenges.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URL
      })
    }),
    UserModule,
    ChallengesModule,
    ConfigModule.forRoot()
  ],
})
export class AppModule { }
