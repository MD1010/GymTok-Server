import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { parseQueryParam } from "src/common/booleanQueryParam";
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
  @ApiQuery({ name: "isRead", type: Boolean, required: false })
  async getAllnotifications(@Query("uid") userId, @Query("isRead") isRead) {
    const notifications = await this.notificationsService.getUserNotifications(userId, parseQueryParam(isRead));
    return notifications;
  }

  @Post()
  @ApiOkResponse({
    description: "Creates new notification",
    type: [NotificationDto],
  })
  async createNotifications(@Body() notificationDto: NotificationDto) {
    return await this.notificationsService.createNotification(notificationDto);
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
    return await this.notificationsService.setUserPushToken(userId, token);
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
    return await this.notificationsService.deleteAllNotifications(userId);
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
    return await this.notificationsService.deleteUserNotification(userId, notificationId);
  }
}
