package com.nexsplit.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Notification entity representing user notifications.
 * 
 * This entity stores various types of notifications for users including
 * invites, reminders, and informational messages. Notifications are
 * associated with users and optionally with specific nex groups.
 * 
 * Database table: notifications
 * 
 * @author NexSplit Team
 * @version 1.0
 * @since 1.0
 */
@Entity
@Table(name = "notifications")
@Data
@EntityListeners({})
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "user_id", nullable = false, columnDefinition = "CHAR(36)")
    private String userId;

    @Column(name = "nex_id", columnDefinition = "CHAR(36)")
    private String nexId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private NotificationType type;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nex_id", insertable = false, updatable = false)
    private Nex nex;

    /**
     * Enumeration of notification types.
     * 
     * INVITE: Invitation to join a nex group
     * REMINDER: Reminder about bills, expenses, or settlements
     * INFO: General informational notifications
     */
    public enum NotificationType {
        INVITE, REMINDER, INFO
    }

    @PrePersist
    protected void onCreate() {
        if (isRead == null) {
            isRead = false;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        modifiedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }

    /**
     * Mark the notification as read.
     */
    public void markAsRead() {
        this.isRead = true;
    }

    /**
     * Mark the notification as unread.
     */
    public void markAsUnread() {
        this.isRead = false;
    }

    /**
     * Check if the notification is read.
     * 
     * @return true if the notification is read, false otherwise
     */
    public boolean isRead() {
        return Boolean.TRUE.equals(this.isRead);
    }
}
