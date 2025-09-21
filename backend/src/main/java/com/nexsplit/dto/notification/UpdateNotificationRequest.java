package com.nexsplit.dto.notification;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating a notification.
 * Contains the fields that can be updated for a notification.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNotificationRequest {

    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String message;

    private Boolean isRead;
}