package com.nexsplit.controller;

import com.nexsplit.config.ApiConfig;
import com.nexsplit.dto.ApiResponse;
import com.nexsplit.dto.PaginatedResponse;
import com.nexsplit.dto.notification.CreateNotificationRequest;
import com.nexsplit.dto.notification.NotificationDto;
import com.nexsplit.dto.notification.UpdateNotificationRequest;
import com.nexsplit.model.Notification;
import com.nexsplit.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing user notifications.
 * 
 * This controller provides endpoints for creating, retrieving, updating, and
 * managing
 * user notifications including invitations, reminders, and informational
 * messages.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping(ApiConfig.API_BASE_PATH + "/notifications")
@Tag(name = "Notifications", description = "User notification management endpoints")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @Operation(summary = "Create Notification", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<NotificationDto>> createNotification(
            @Valid @RequestBody CreateNotificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Creating notification for user: {}", userId);

        NotificationDto notification = notificationService.createNotification(request);
        return ResponseEntity.ok(ApiResponse.success(notification, "Notification created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get User Notifications", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PaginatedResponse<NotificationDto>>> getUserNotifications(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Getting notifications for user: {}, page: {}, size: {}", userId, page, size);

        PaginatedResponse<NotificationDto> response = notificationService.getUserNotifications(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Notifications retrieved successfully"));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get Unread Notification Count", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Long>> getUnreadNotificationCount(
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Getting unread notification count for user: {}", userId);

        long count = notificationService.getUnreadNotificationCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Unread notification count retrieved successfully"));
    }

    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Mark Notification as Read", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String notificationId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Marking notification as read: {} for user: {}", notificationId, userId);

        notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Notification marked as read successfully"));
    }

    @PutMapping("/mark-all-read")
    @Operation(summary = "Mark All Notifications as Read", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Marking all notifications as read for user: {}", userId);

        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read successfully"));
    }

    @PutMapping("/{notificationId}")
    @Operation(summary = "Update Notification", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<NotificationDto>> updateNotification(
            @PathVariable String notificationId,
            @Valid @RequestBody UpdateNotificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Updating notification: {} for user: {}", notificationId, userId);

        NotificationDto notification = notificationService.updateNotification(notificationId, request, userId);
        return ResponseEntity.ok(ApiResponse.success(notification, "Notification updated successfully"));
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "Delete Notification", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable String notificationId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Deleting notification: {} for user: {}", notificationId, userId);

        notificationService.deleteNotification(notificationId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Notification deleted successfully"));
    }

    @GetMapping("/by-type")
    @Operation(summary = "Get Notifications by Type", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PaginatedResponse<NotificationDto>>> getNotificationsByType(
            @RequestParam Notification.NotificationType type,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Getting notifications by type for user: {}, type: {}, page: {}, size: {}", userId, type, page, size);

        PaginatedResponse<NotificationDto> response = notificationService.getNotificationsByType(userId, type, page,
                size);
        return ResponseEntity.ok(ApiResponse.success(response, "Notifications by type retrieved successfully"));
    }

    @GetMapping("/unread")
    @Operation(summary = "Get Unread Notifications", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PaginatedResponse<NotificationDto>>> getUnreadNotifications(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("Getting unread notifications for user: {}, page: {}, size: {}", userId, page, size);

        PaginatedResponse<NotificationDto> response = notificationService.getUnreadNotifications(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, "Unread notifications retrieved successfully"));
    }
}
