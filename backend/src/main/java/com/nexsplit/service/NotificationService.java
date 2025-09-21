package com.nexsplit.service;

import com.nexsplit.dto.PaginatedResponse;
import com.nexsplit.dto.notification.NotificationDto;
import com.nexsplit.dto.notification.CreateNotificationRequest;
import com.nexsplit.dto.notification.UpdateNotificationRequest;
import com.nexsplit.model.Notification;

/**
 * Service interface for managing user notifications.
 * 
 * This service provides methods for creating, retrieving, updating, and
 * managing
 * user notifications including invitations, reminders, and informational
 * messages.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
public interface NotificationService {

    /**
     * Create a new notification.
     * 
     * @param request The notification creation request
     * @return The created notification DTO
     */
    NotificationDto createNotification(CreateNotificationRequest request);

    /**
     * Get paginated notifications for a user.
     * 
     * @param userId The user ID
     * @param page   The page number
     * @param size   The page size
     * @return Paginated notifications
     */
    PaginatedResponse<NotificationDto> getUserNotifications(String userId, int page, int size);

    /**
     * Get unread notification count for a user.
     * 
     * @param userId The user ID
     * @return The count of unread notifications
     */
    long getUnreadNotificationCount(String userId);

    /**
     * Mark a notification as read.
     * 
     * @param notificationId The notification ID
     * @param userId         The user ID
     */
    void markAsRead(String notificationId, String userId);

    /**
     * Mark all notifications as read for a user.
     * 
     * @param userId The user ID
     */
    void markAllAsRead(String userId);

    /**
     * Update a notification.
     * 
     * @param notificationId The notification ID
     * @param request        The update request
     * @param userId         The user ID
     * @return The updated notification DTO
     */
    NotificationDto updateNotification(String notificationId, UpdateNotificationRequest request, String userId);

    /**
     * Delete a notification.
     * 
     * @param notificationId The notification ID
     * @param userId         The user ID
     */
    void deleteNotification(String notificationId, String userId);

    /**
     * Create an invitation notification.
     * 
     * @param nexId     The Nex ID
     * @param userId    The invited user ID
     * @param inviterId The inviter user ID
     * @param nexName   The Nex name
     * @param message   The invitation message
     */
    void createInvitationNotification(String nexId, String userId, String inviterId, String nexName, String message);

    /**
     * Create a member joined notification.
     * 
     * @param nexId   The Nex ID
     * @param userId  The user who joined
     * @param nexName The Nex name
     */
    void createMemberJoinedNotification(String nexId, String userId, String nexName);

    /**
     * Create a member left notification.
     * 
     * @param nexId   The Nex ID
     * @param userId  The user who left
     * @param nexName The Nex name
     */
    void createMemberLeftNotification(String nexId, String userId, String nexName);

    /**
     * Create an expense added notification.
     * 
     * @param nexId        The Nex ID
     * @param userId       The user who added the expense
     * @param nexName      The Nex name
     * @param expenseTitle The expense title
     */
    void createExpenseAddedNotification(String nexId, String userId, String nexName, String expenseTitle);

    /**
     * Create an expense updated notification.
     * 
     * @param nexId        The Nex ID
     * @param userId       The user who updated the expense
     * @param nexName      The Nex name
     * @param expenseTitle The expense title
     */
    void createExpenseUpdatedNotification(String nexId, String userId, String nexName, String expenseTitle);

    /**
     * Create a settlement executed notification.
     * 
     * @param nexId   The Nex ID
     * @param userId  The user who executed the settlement
     * @param nexName The Nex name
     * @param amount  The settlement amount
     */
    void createSettlementExecutedNotification(String nexId, String userId, String nexName, String amount);

    /**
     * Create a debt reminder notification.
     * 
     * @param nexId   The Nex ID
     * @param userId  The user who owes money
     * @param nexName The Nex name
     * @param amount  The debt amount
     */
    void createDebtReminderNotification(String nexId, String userId, String nexName, String amount);

    /**
     * Get notifications by type for a user.
     * 
     * @param userId The user ID
     * @param type   The notification type
     * @param page   The page number
     * @param size   The page size
     * @return Paginated notifications
     */
    PaginatedResponse<NotificationDto> getNotificationsByType(String userId, Notification.NotificationType type,
            int page, int size);

    /**
     * Get unread notifications for a user.
     * 
     * @param userId The user ID
     * @param page   The page number
     * @param size   The page size
     * @return Paginated unread notifications
     */
    PaginatedResponse<NotificationDto> getUnreadNotifications(String userId, int page, int size);
}
