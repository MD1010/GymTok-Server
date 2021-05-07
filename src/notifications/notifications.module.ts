import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthService } from "src/auth/auth.service";
import { UserModule } from "src/users/user.module";
import { UsersService } from "src/users/users.service";
import { Notification, NotificationSchema } from "./notification.model";
import { NotificationsService } from "./notification.service";
import { NotificationsController } from "./notifications.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), UserModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [],
})
export class NotificationsModule {}
