import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";
import { ChallengesModule } from "./challenges/challenges.module";
import { ConfigModule } from "@nestjs/config";
import { FilesModule } from "./files/files.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URL,
      }),
    }),
    AuthModule,
    UserModule,
    ChallengesModule,
    FilesModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
