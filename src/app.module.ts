import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { FilesModule } from "./files/files.module";
import { PostsModule } from "./posts/posts.module";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URL,
      }),
    }),
    AuthModule,
    UserModule,
    FilesModule,
    ConfigModule.forRoot(),
    PostsModule
  ],
})
export class AppModule { }
