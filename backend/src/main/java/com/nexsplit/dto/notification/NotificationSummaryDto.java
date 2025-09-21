package com.nexsplit.dto.notification;

import com.nexsplit.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Summary DTO for notification data transfer.
 * 
 * This DTO represents a simplified notification view with essential
 * information for listing and summary purposes.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSummaryDto {

    private String id;
    private String nexId;
    private Notification.NotificationType type;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}