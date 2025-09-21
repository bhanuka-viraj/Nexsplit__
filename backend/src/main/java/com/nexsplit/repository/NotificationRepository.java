package com.nexsplit.repository;

import com.nexsplit.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Notification entity operations.
 * 
 * This repository provides methods for querying and managing notification
 * entities including user-specific queries and read status management.
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

        /**
         * Find notifications for a specific user with pagination.
         * 
         * @param userId   The user ID
         * @param pageable The pagination information
         * @return Page of notifications
         */
        @Query("SELECT n FROM Notification n " +
                        "JOIN FETCH n.user " +
                        "LEFT JOIN FETCH n.nex " +
                        "WHERE n.userId = :userId ORDER BY n.createdAt DESC")
        Page<Notification> findByUserIdPaginated(@Param("userId") String userId, Pageable pageable);

        /**
         * Find unread notifications for a specific user.
         * 
         * @param userId The user ID
         * @return List of unread notifications
         */
        @Query("SELECT n FROM Notification n " +
                        "JOIN FETCH n.user " +
                        "LEFT JOIN FETCH n.nex " +
                        "WHERE n.userId = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
        List<Notification> findUnreadByUserId(@Param("userId") String userId);

        /**
         * Count unread notifications for a specific user.
         * 
         * @param userId The user ID
         * @return Count of unread notifications
         */
        @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false")
        long countUnreadByUserId(@Param("userId") String userId);

        /**
         * Find notifications by type for a specific user.
         * 
         * @param userId   The user ID
         * @param type     The notification type
         * @param pageable The pagination information
         * @return Page of notifications
         */
        @Query("SELECT n FROM Notification n " +
                        "JOIN FETCH n.user " +
                        "LEFT JOIN FETCH n.nex " +
                        "WHERE n.userId = :userId AND n.type = :type ORDER BY n.createdAt DESC")
        Page<Notification> findByUserIdAndTypePaginated(@Param("userId") String userId,
                        @Param("type") Notification.NotificationType type, Pageable pageable);

        /**
         * Find notifications for a specific Nex.
         * 
         * @param nexId    The Nex ID
         * @param pageable The pagination information
         * @return Page of notifications
         */
        @Query("SELECT n FROM Notification n " +
                        "JOIN FETCH n.user " +
                        "LEFT JOIN FETCH n.nex " +
                        "WHERE n.nexId = :nexId ORDER BY n.createdAt DESC")
        Page<Notification> findByNexIdPaginated(@Param("nexId") String nexId, Pageable pageable);

        /**
         * Mark all notifications as read for a user.
         * 
         * @param userId The user ID
         */
        @Modifying
        @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
        void markAllAsReadByUserId(@Param("userId") String userId);

        /**
         * Mark a specific notification as read.
         * 
         * @param notificationId The notification ID
         * @param userId         The user ID
         */
        @Modifying
        @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId AND n.userId = :userId")
        void markAsReadByIdAndUserId(@Param("notificationId") String notificationId, @Param("userId") String userId);

        /**
         * Find unread notifications for a specific user with pagination.
         * 
         * @param userId   The user ID
         * @param pageable The pagination information
         * @return Page of unread notifications
         */
        @Query("SELECT n FROM Notification n " +
                        "JOIN FETCH n.user " +
                        "LEFT JOIN FETCH n.nex " +
                        "WHERE n.userId = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
        Page<Notification> findUnreadByUserIdPaginated(@Param("userId") String userId, Pageable pageable);

        /**
         * Count read notifications created before the specified date.
         * Used for scheduled cleanup to track how many notifications will be deleted.
         * 
         * @param cutoffDate The cutoff date
         * @return Count of read notifications older than cutoff date
         */
        @Query("SELECT COUNT(n) FROM Notification n WHERE n.createdAt < :cutoffDate AND n.isRead = true")
        long countByCreatedAtBeforeAndIsReadTrue(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);

        /**
         * Delete read notifications created before the specified date.
         * Used for scheduled cleanup to remove old read notifications.
         * 
         * @param cutoffDate The cutoff date
         */
        @Modifying
        @Query("DELETE FROM Notification n WHERE n.createdAt < :cutoffDate AND n.isRead = true")
        void deleteByCreatedAtBeforeAndIsReadTrue(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);
}
