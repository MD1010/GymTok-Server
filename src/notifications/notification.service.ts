import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { User } from "src/users/user.model";
import { UsersService } from "src/users/users.service";
import { Notification, NotificationDto } from "./notification.model";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationsModel: Model<Notification>,
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private readonly userService: UsersService
  ) {}
  async getUserNotifications(userId: string, isRead?: boolean) {
    if (!userId) {
      return await this.notificationsModel.find();
    }
    const userNotifications = await this.notificationsModel.find({ notifiedUsers: userId } as FilterQuery<
      Notification[]
    >);
    if (isRead === undefined) {
      return userNotifications;
    }
    return userNotifications.filter((notification) =>
      isRead ? notification?.readBy?.includes(userId as any) : !notification?.readBy?.includes(userId as any)
    );
  }
  createNotification(notification: NotificationDto) {
    return this.notificationsModel.create(notification);
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
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException({}, HttpStatus.NO_CONTENT);
    } else {
      const res = await this.notificationsModel.updateMany({ notifiedUsers: userId } as any, {
        $pull: { notifiedUsers: userId, readBy: userId as any } as any,
      });
      if (res.n) {
        return res;
      } else {
        throw new HttpException({}, HttpStatus.NO_CONTENT);
      }
    }
  }
  async deleteUserNotification(userId: string, notificationId: string) {
    // remove the user from the notifiers array
    const userNotifications = await this.getUserNotifications(userId);
    const isUserNotification = userNotifications.find((x) => x._id == notificationId);

    if (!userNotifications.length || !isUserNotification) {
      throw new HttpException({}, HttpStatus.NO_CONTENT);
    } else {
      const res = await this.notificationsModel.updateOne(
        { _id: notificationId },
        { $pull: { notifiedUsers: userId as any, readBy: userId as any } }
      );

      if (res.n) {
        return res;
      } else {
        throw new HttpException({}, HttpStatus.NO_CONTENT);
      }
    }
  }
  async markNotificationAsRead(userId: string, notificationId: string) {
    const userNotifications = await this.getUserNotifications(userId);
    const userNotification = userNotifications.find((x) => x._id == notificationId);
    const isNotificationRead = userNotification?.readBy?.includes(userId as any);

    if (!userNotifications.length || !userNotification || isNotificationRead) {
      throw new BadRequestException("Failed to mark notification as read");
    } else {
      const res = await this.notificationsModel.updateOne(
        { _id: notificationId },
        { $push: { readBy: userId as any } }
      );
      if (res.n) {
        return res;
      } else {
        throw new BadRequestException("Failed to mark notification as read");
      }
    }
  }
  sendPushNotification(recipientPushToken: string, title: string, body?: string, data?: string) {}
  getNotificationCounter(userId: string) {}

  // todo create endpoint in users model to get push token
}
