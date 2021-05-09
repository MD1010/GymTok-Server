import { Notification } from "./notification.model";

export const normalizeNotificationObject = (notification: Notification, userId: string) => {
  const { date, data, title, body, _id, sender } = notification;
  const response: any = { date, data, title, body, _id, sender };
  response.isRead = notification.readBy.includes(userId as any);
  return response;
};
