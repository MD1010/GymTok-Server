import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express/multer";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { NotificationDto } from "./notification.model";
import { NotificationsService } from "./notification.service";
import { Transform } from "class-transformer";
import { isBoolean } from "class-validator";
import { parseQueryParam } from "src/common/booleanQueryParam";
// export function ToBoolean() {
//   return Transform((v) => ["1", 1, "true", true].includes(v));
// }
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
}
