import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/users/user.module";
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
