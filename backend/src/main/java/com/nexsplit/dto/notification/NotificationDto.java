package com.nexsplit.dto.notification;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nexsplit.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for notification data transfer.
 * 
 * This DTO represents a notification with all its properties including
 * user information, notification type, message, and read status.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDto {

    private String id;
    private String userId;
    private String nexId;
    private Notification.NotificationType type;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    // User information
    private String userName;
    private String userEmail;

    // Nex information
    private String nexName;
}