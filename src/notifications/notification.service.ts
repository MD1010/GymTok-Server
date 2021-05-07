import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { User } from "src/users/user.model";
import { Notification, NotificationDto } from "./notification.model";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationsModel: Model<Notification>,
    @InjectModel(User.name) private readonly usersModel: Model<User>
  ) {}
  async getUserNotifications(userId: string) {
    return userId
      ? await this.notificationsModel.find({ notifiedUsers: userId } as FilterQuery<Notification[]>)
      : this.notificationsModel.find();
  }
  async setUserPushToken(userId: string, token: string) {
    const res = await this.usersModel.updateOne({ _id: userId }, { pushToken: token });
    if (res.nModified) {
      return res;
    } else {
      throw new BadRequestException("Failed to set push token to this user");
    }
  }
  async deleteAllNotifications(userId: string) {
    // const res = await this.notificationsModel.deleteMany({ notifiedUsers: userId });
    // if (res.n) {
    //   return res;
    // } else {
    //   throw new HttpException({}, HttpStatus.NO_CONTENT);
    // }
  }
  deleteNotification(userId: string, notificationId: string) {}
  markNotificationAsRead(userId: string, notificationId: string) {}
  createNotification(notification: NotificationDto) {
    return this.notificationsModel.create(notification);
  }
  sendPushNotification(recipientPushToken: string, title: string, body?: string, data?: string) {}
  getNotificationCounter(userId: string) {}
  // todo create endpoint in users model to get push token
}
