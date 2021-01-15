import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './users/user.module';
import * as config from './common/config.json'

@Module({
  imports: [MongooseModule.forRoot(config.MONGO_URL), UserModule],
})
export class AppModule { }
