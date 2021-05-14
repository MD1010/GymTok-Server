import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { NotificationDto } from "./notification.model";
import { NotificationsService } from "./notification.service";

@Controller("notifications")
@ApiTags("Notifications")
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Gets all notifications of specific user",
    type: [NotificationDto],
  })
  @ApiQuery({ name: "uid", type: String, required: false })
  // @ApiQuery({ name: "isRead", type: Boolean, required: false })
  async getAllnotifications(@Query("uid") userId) {
    const notifications = await this.notificationsService.getUserNotifications(userId);
    return notifications;
  }

  @Post("/send")
  @ApiAcceptedResponse({
    description: "Notification sent successfully",
    type: [NotificationDto],
  })
  async sendPushNotifications(@Body() notificationDto: NotificationDto) {
    const { notifiedUsers } = notificationDto;
    const notification = await await this.notificationsService.createNotification(notificationDto);
    const recipientPushTokens = await this.notificationsService.getPushTokens(notifiedUsers);
    await this.notificationsService.sendPushNotification(recipientPushTokens, notification);
    return notification;
  }

  @Put("/pushToken")
  @ApiOkResponse({
    description: "Push token was set successfully",
    type: [NotificationDto],
  })
  @ApiBadRequestResponse({
    description: "Failed to set push token to this user",
    type: [NotificationDto],
  })
  async setUserPushToken(@Body() pushTokenDto: { userId: string; token: string }) {
    const { userId, token } = pushTokenDto;
    console.log("setting push token for user", pushTokenDto);
    return await this.notificationsService.setUserPushToken(userId, token);
  }

  @Delete("/pushToken")
  @ApiOkResponse({
    description: "Push token was removed successfully",
    type: [NotificationDto],
  })
  @ApiBadRequestResponse({
    description: "Failed to removed push token from this user",
    type: [NotificationDto],
  })
  async removeUserPushToken(@Body() pushTokenDto: { userId: string; token: string }) {
    const { userId, token } = pushTokenDto;
    console.log("removing push token from user", pushTokenDto);
    return await this.notificationsService.removeUserPushToken(userId, token);
  }

  @Delete("/:userId")
  @ApiAcceptedResponse({
    description: "Notifications deleted successfully",
    type: [NotificationDto],
  })
  @ApiNoContentResponse({
    description: "Failed to delete notifications",
    type: [NotificationDto],
  })
  async deleteUserNotifications(@Param("userId") userId: string) {
    const res = await this.notificationsService.deleteAllNotifications(userId);
    if (!res) throw new HttpException({}, HttpStatus.NO_CONTENT);
    return res;
  }

  @Delete("/:notificationId/:userId")
  @ApiAcceptedResponse({
    description: "Notification deleted successfully",
    type: [NotificationDto],
  })
  @ApiNoContentResponse({
    description: "Failed to delete notification",
    type: [NotificationDto],
  })
  async deleteUserNotification(@Param("notificationId") notificationId: string, @Param("userId") userId: string) {
    const res = await this.notificationsService.deleteUserNotification(userId, notificationId);
    if (!res) throw new HttpException({}, HttpStatus.NO_CONTENT);
    return res;
  }

  @Put("/:notificationId/:userId")
  @ApiAcceptedResponse({
    description: "Notification marked as read successfully",
    type: [NotificationDto],
  })
  @ApiBadRequestResponse({
    description: "Failed to mark notification as read by user",
    type: [NotificationDto],
  })
  async markNotificationAsRead(@Param("notificationId") notificationId: string, @Param("userId") userId: string) {
    const res = await this.notificationsService.markNotificationAsRead(userId, notificationId);
    if (!res) throw new BadRequestException("Failed to mark notification as read");
    return res;
  }
}
