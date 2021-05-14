import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import axios from "axios";
import { FilterQuery, Model } from "mongoose";
import { User } from "src/users/user.model";
import { UsersService } from "src/users/users.service";
import { EXPO_PUSH_ENDPOINT } from "./consts";
import { Notification, NotificationDto } from "./notification.model";
import { normalizeNotificationObject } from "./notification.parser";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationsModel: Model<Notification>,
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    private readonly userService: UsersService
  ) {}
  private populatedSenderFields: any = { _id: 1, username: 1, fullName: 1, email: 1, image: 1 };
  async getUserNotifications(userId: string) {
    const userNotifications = await this.notificationsModel
      .find(!!userId ? { notifiedUsers: userId } : ({} as FilterQuery<Notification[]>))
      .sort({ date: -1 })
      .populate("sender", this.populatedSenderFields)
      .exec();
    return userNotifications.map((notification) => {
      return normalizeNotificationObject(notification, userId);
    });
  }
  async createNotification(notification: NotificationDto) {
    return await (await this.notificationsModel.create(notification))
      .populate("sender", this.populatedSenderFields)
      .execPopulate();
  }
  async setUserPushToken(userId: string, token: string) {
    return await this.usersModel.updateOne({ _id: userId }, { $addToSet: { pushTokens: token } });
  }

  async removeUserPushToken(userId: string, token: string) {
    return await this.usersModel.updateOne({ _id: userId }, { $pull: { pushTokens: token } });
  }

  async getNotification(notificationId: string, userId: string) {
    const notification = await this.notificationsModel.findById(notificationId);
    return normalizeNotificationObject(notification, userId);
  }

  async deleteAllNotifications(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      return null;
    } else {
      const res = await this.notificationsModel.updateMany({ notifiedUsers: userId } as any, {
        $pull: { notifiedUsers: userId, readBy: userId as any } as any,
      });
      if (res.n) {
        return res;
      } else {
        return null;
      }
    }
  }
  async deleteUserNotification(userId: string, notificationId: string) {
    // remove the user from the notifiers array
    const userNotifications = await this.getUserNotifications(userId);
    const userNotification = userNotifications.find((x) => x._id == notificationId);

    if (!userNotifications.length || !userNotification) {
      return null;
    } else {
      const res = await this.notificationsModel.updateOne(
        { _id: notificationId },
        { $pull: { notifiedUsers: userId as any, readBy: userId as any } }
      );

      if (res.n) {
        return userNotification;
      } else {
        return null;
      }
    }
  }
  async markNotificationAsRead(userId: string, notificationId: string) {
    const userNotifications = await this.getUserNotifications(userId);
    const userNotification = userNotifications.find((x) => x._id == notificationId);
    const isNotificationRead = userNotification?.isRead;

    if (!userNotifications.length || !userNotification || isNotificationRead) {
      return null;
    } else {
      const res = await this.notificationsModel.updateOne(
        { _id: notificationId },
        { $push: { readBy: userId as any } }
      );
      if (res.n) {
        return userNotification;
      } else {
        return null;
      }
    }
  }
  async sendPushNotification(recipientPushTokens: {}, notification: Notification) {
    const { date, _id, title, body, data, sender } = notification;
    let notificationPayload = [];
    console.log("reciepent", recipientPushTokens);

    Object.keys(recipientPushTokens).map((userId) => {
      const recipients = recipientPushTokens[userId];
      for (const recipient of recipients) {
        if (recipient) {
          notificationPayload.push({
            to: recipient,
            sound: "default",
            title,
            body,
            data: { ...data, _id, date, sender: sender.toJSON() },
          });
        }
      }
    });

    return await axios.post(EXPO_PUSH_ENDPOINT, notificationPayload, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  }

  async getPushTokens(notifiedUsers: string[]) {
    const pushTokensRes = {};
    await Promise.all(
      notifiedUsers.map(async (user) => {
        const foundUser = await this.userService.findUserById(user);
        pushTokensRes[user] = foundUser?.pushTokens;
      })
    );
    return pushTokensRes;
  }
}
