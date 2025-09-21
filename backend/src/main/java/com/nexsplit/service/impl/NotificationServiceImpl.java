package com.nexsplit.service.impl;

import com.nexsplit.dto.PaginatedResponse;
import com.nexsplit.dto.notification.CreateNotificationRequest;
import com.nexsplit.dto.notification.NotificationDto;
import com.nexsplit.dto.notification.UpdateNotificationRequest;
import com.nexsplit.exception.BusinessException;
import com.nexsplit.exception.EntityNotFoundException;
import com.nexsplit.mapper.notification.NotificationMapStruct;
import com.nexsplit.model.Notification;
import com.nexsplit.repository.NotificationRepository;
import com.nexsplit.service.EventService;
import com.nexsplit.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of NotificationService for managing user notifications.
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
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

        private final NotificationRepository notificationRepository;
        private final NotificationMapStruct notificationMapStruct;
        private final EventService eventService;

        @Override
        @Transactional
        public NotificationDto createNotification(CreateNotificationRequest request) {
                log.info("Creating notification for user: {}", request.getUserId());

                Notification notification = notificationMapStruct.toEntity(request);
                notification = notificationRepository.save(notification);

                // Broadcast new notification event
                eventService.broadcastNewNotification(notification.getUserId(), notification.getId(),
                                notification.getMessage());

                log.info("Notification created successfully: {}", notification.getId());
                return notificationMapStruct.toDto(notification);
        }

        @Override
        @Transactional(readOnly = true)
        public PaginatedResponse<NotificationDto> getUserNotifications(String userId, int page, int size) {
                log.info("Getting notifications for user: {}, page: {}, size: {}", userId, page, size);

                Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
                Page<Notification> notificationPage = notificationRepository.findByUserIdPaginated(userId, pageable);

                List<NotificationDto> notificationDtos = notificationPage.getContent().stream()
                                .map(notificationMapStruct::toDto)
                                .toList();

                return PaginatedResponse.<NotificationDto>builder()
                                .data(notificationDtos)
                                .pagination(PaginatedResponse.PaginationInfo.builder()
                                                .page(page)
                                                .size(size)
                                                .totalElements(notificationPage.getTotalElements())
                                                .totalPages(notificationPage.getTotalPages())
                                                .hasNext(notificationPage.hasNext())
                                                .hasPrevious(notificationPage.hasPrevious())
                                                .build())
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public long getUnreadNotificationCount(String userId) {
                log.debug("Getting unread notification count for user: {}", userId);
                return notificationRepository.countUnreadByUserId(userId);
        }

        @Override
        @Transactional
        public void markAsRead(String notificationId, String userId) {
                log.info("Marking notification as read: {} for user: {}", notificationId, userId);

                // Verify notification exists and belongs to user
                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> EntityNotFoundException.notificationNotFound(notificationId));

                if (!notification.getUserId().equals(userId)) {
                        throw new BusinessException("Notification does not belong to user",
                                        com.nexsplit.dto.ErrorCode.AUTHZ_INSUFFICIENT_PERMISSIONS);
                }

                notificationRepository.markAsReadByIdAndUserId(notificationId, userId);

                // Broadcast notification read event
                eventService.broadcastNotificationRead(userId, notificationId);

                log.info("Notification marked as read successfully: {}", notificationId);
        }

        @Override
        @Transactional
        public void markAllAsRead(String userId) {
                log.info("Marking all notifications as read for user: {}", userId);
                notificationRepository.markAllAsReadByUserId(userId);
                log.info("All notifications marked as read for user: {}", userId);
        }

        @Override
        @Transactional
        public NotificationDto updateNotification(String notificationId, UpdateNotificationRequest request,
                        String userId) {
                log.info("Updating notification: {} for user: {}", notificationId, userId);

                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> EntityNotFoundException.notificationNotFound(notificationId));

                if (!notification.getUserId().equals(userId)) {
                        throw new BusinessException("Notification does not belong to user",
                                        com.nexsplit.dto.ErrorCode.AUTHZ_INSUFFICIENT_PERMISSIONS);
                }

                notificationMapStruct.updateFromRequest(request, notification);
                notification = notificationRepository.save(notification);

                log.info("Notification updated successfully: {}", notificationId);
                return notificationMapStruct.toDto(notification);
        }

        @Override
        @Transactional
        public void deleteNotification(String notificationId, String userId) {
                log.info("Deleting notification: {} for user: {}", notificationId, userId);

                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> EntityNotFoundException.notificationNotFound(notificationId));

                if (!notification.getUserId().equals(userId)) {
                        throw new BusinessException("Notification does not belong to user",
                                        com.nexsplit.dto.ErrorCode.AUTHZ_INSUFFICIENT_PERMISSIONS);
                }

                notificationRepository.delete(notification);

                // Broadcast notification deleted event
                eventService.broadcastNotificationDeleted(userId, notificationId);

                log.info("Notification deleted successfully: {}", notificationId);
        }

        @Override
        @Transactional
        public void createInvitationNotification(String nexId, String userId, String inviterId, String nexName,
                        String message) {
                log.info("Creating invitation notification for user: {} to nex: {}", userId, nexId);

                // Use the provided message or fallback to default
                String notificationMessage = (message != null && !message.trim().isEmpty())
                                ? message
                                : String.format("You have been invited to join the group '%s'", nexName);

                Notification notification = Notification.builder()
                                .userId(userId)
                                .nexId(nexId)
                                .type(Notification.NotificationType.INVITE)
                                .message(notificationMessage)
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("Invitation notification created successfully for user: {} to nex: {}", userId, nexId);
        }

        @Override
        @Transactional
        public void createMemberJoinedNotification(String nexId, String userId, String nexName) {
                log.info("Creating member joined notification for nex: {}", nexId);

                String message = String.format("A new member has joined the group '%s'", nexName);

                Notification notification = Notification.builder()
                                .userId(userId)
                                .nexId(nexId)
                                .type(Notification.NotificationType.INFO)
                                .message(message)
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("Member joined notification created successfully for nex: {}", nexId);
        }

        @Override
        @Transactional
        public void createMemberLeftNotification(String nexId, String userId, String nexName) {
                log.info("Creating member left notification for nex: {}", nexId);

                String message = String.format("A member has left the group '%s'", nexName);

                Notification notification = Notification.builder()
                                .userId(userId)
                                .nexId(nexId)
                                .type(Notification.NotificationType.INFO)
                                .message(message)
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("Member left notification created successfully for nex: {}", nexId);
        }

        @Override
        @Transactional
        public void createExpenseAddedNotification(String nexId, String userId, String nexName, String expenseTitle) {
                log.info("Creating expense added notification for nex: {}", nexId);

                String message = String.format("New expense '%s' added to '%s'", expenseTitle, nexName);

                Notification notification = Notification.builder()
                                .userId(userId)
                                .nexId(nexId)
                                .type(Notification.NotificationType.INFO)
                                .message(message)
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("Expense added notification created successfully for nex: {}", nexId);
        }

        @Override
        @Transactional
        public void createExpenseUpdatedNotification(String nexId, String userId, String nexName, String expenseTitle) {
                log.info("Creating expense updated notification for nex: {}", nexId);

                String message = String.format("Expense '%s' updated in '%s'", expenseTitle, nexName);

                Notification notification = Notification.builder()
                                .userId(userId)
                                .nexId(nexId)
                                .type(Notification.NotificationType.INFO)
                                .message(message)
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("Expense updated notification created successfully for nex: {}", nexId);
        }

        @Override
        @Transactional
        public void createSettlementExecutedNotification(String nexId, String userId, String nexName, String amount) {
                log.info("Creating settlement executed notification for nex: {}", nexId);

                String message = String.format("Settlement of %s completed in '%s'", amount, nexName);

                Notification notification = Notification.builder()
                                .userId(userId)
                                .nexId(nexId)
                                .type(Notification.NotificationType.INFO)
                                .message(message)
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("Settlement executed notification created successfully for nex: {}", nexId);
        }

        @Override
        @Transactional
        public void createDebtReminderNotification(String nexId, String userId, String nexName, String amount) {
                log.info("Creating debt reminder notification for nex: {}", nexId);

                String message = String.format("You owe %s to '%s'", amount, nexName);

                Notification notification = Notification.builder()
                                .userId(userId)
                                .nexId(nexId)
                                .type(Notification.NotificationType.REMINDER)
                                .message(message)
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("Debt reminder notification created successfully for nex: {}", nexId);
        }

        @Override
        @Transactional(readOnly = true)
        public PaginatedResponse<NotificationDto> getNotificationsByType(String userId,
                        Notification.NotificationType type,
                        int page, int size) {
                log.info("Getting notifications by type for user: {}, type: {}, page: {}, size: {}", userId, type, page,
                                size);

                Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
                Page<Notification> notificationPage = notificationRepository.findByUserIdAndTypePaginated(userId, type,
                                pageable);

                List<NotificationDto> notificationDtos = notificationPage.getContent().stream()
                                .map(notificationMapStruct::toDto)
                                .toList();

                return PaginatedResponse.<NotificationDto>builder()
                                .data(notificationDtos)
                                .pagination(PaginatedResponse.PaginationInfo.builder()
                                                .page(page)
                                                .size(size)
                                                .totalElements(notificationPage.getTotalElements())
                                                .totalPages(notificationPage.getTotalPages())
                                                .hasNext(notificationPage.hasNext())
                                                .hasPrevious(notificationPage.hasPrevious())
                                                .build())
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public PaginatedResponse<NotificationDto> getUnreadNotifications(String userId, int page, int size) {
                log.info("Getting unread notifications for user: {}, page: {}, size: {}", userId, page, size);

                Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
                Page<Notification> notificationPage = notificationRepository.findUnreadByUserIdPaginated(userId,
                                pageable);

                List<NotificationDto> notificationDtos = notificationPage.getContent().stream()
                                .map(notificationMapStruct::toDto)
                                .toList();

                return PaginatedResponse.<NotificationDto>builder()
                                .data(notificationDtos)
                                .pagination(PaginatedResponse.PaginationInfo.builder()
                                                .page(page)
                                                .size(size)
                                                .totalElements(notificationPage.getTotalElements())
                                                .totalPages(notificationPage.getTotalPages())
                                                .hasNext(notificationPage.hasNext())
                                                .hasPrevious(notificationPage.hasPrevious())
                                                .build())
                                .build();
        }

        /**
         * Scheduled cleanup method to delete all read notifications older than 6
         * months.
         * Runs daily at 2 AM to maintain database performance and control storage
         * growth.
         */
        @Scheduled(cron = "0 0 2 * * ?")
        @Transactional
        public void cleanupOldReadNotifications() {
                try {
                        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(6);

                        // Count notifications to be deleted for logging
                        long countBefore = notificationRepository.countByCreatedAtBeforeAndIsReadTrue(cutoffDate);

                        if (countBefore > 0) {
                                // Delete read notifications older than 6 months
                                notificationRepository.deleteByCreatedAtBeforeAndIsReadTrue(cutoffDate);

                                log.info("Scheduled cleanup completed: Deleted {} read notifications older than 6 months",
                                                countBefore);
                        } else {
                                log.debug("Scheduled cleanup: No read notifications older than 6 months found");
                        }
                } catch (Exception e) {
                        log.error("Error during scheduled notification cleanup", e);
                }
        }
}
